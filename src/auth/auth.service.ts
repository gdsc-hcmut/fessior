import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { Types } from 'mongoose';
import { PASSWORD_REGEX, SALT_ROUNDS } from 'src/constants';

import { JwtService } from '../jwt/jwt.service';
import { OrganizationsService } from '../organization/organizations.service';
import { TokensService } from '../token/tokens.service';
import { UsersService } from '../users/users.service';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  public async loginWithGoogleToken(
    token: string,
  ): Promise<{ accessToken: string; hasPassword: boolean; isFirstLogin: boolean }> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const googleId = ticket.getUserId();

    if (googleId == null) {
      throw Error('Token is not valid');
    }

    const tokenInfo = ticket.getPayload();

    if (!tokenInfo || tokenInfo.exp < Date.now() / 1000) {
      throw Error('Token is not valid');
    }

    const { email } = tokenInfo;

    if (!email) {
      throw new Error('Could not find email of Token');
    }

    let user = await this.usersService.getByEmail(email);
    let isFirstLogin = false;
    if (!user) {
      isFirstLogin = true;
      // TODO: apply transaction here, if failed to create user or org, rollback
      user = await this.usersService.create({
        firstName: tokenInfo.given_name || null,
        lastName: tokenInfo.family_name || null,
        picture: tokenInfo.picture || null,
        email,
        googleId,
        dateOfBirth: null,
        phone: null,
        appleId: null,
        isManager: false,
        password: null,
      });
      await this.organizationsService.createOrganizationForUser(user._id);
    }

    const newToken = await this.tokensService.createToken(user._id);

    const payload = { tokenId: newToken._id };

    return { accessToken: await this.jwtService.signAsync(payload), hasPassword: !!user.password, isFirstLogin };
  }

  public async loginWithUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<{ accessToken: string; hasPassword: boolean; isFirstLogin: boolean }> {
    const user = await this.usersService.getByEmail(username);
    if (!user) {
      throw new NotFoundException('Username not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password not match');
    }

    const newToken = await this.tokensService.createToken(user._id);

    const payload = { tokenId: newToken._id };

    return { accessToken: await this.jwtService.signAsync(payload), hasPassword: true, isFirstLogin: false };
  }

  public async logout(accessToken: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(accessToken);

    const { tokenId }: { tokenId: string } = payload;

    await this.tokensService.deactivateToken(tokenId);
  }

  public async createPassword(userId: string, password: string): Promise<boolean> {
    if (!PASSWORD_REGEX.test(password)) {
      throw new BadRequestException('Invalid password');
    }

    let user = await this.usersService.findById(new Types.ObjectId(userId));
    if (user?.password) {
      throw new BadRequestException('User already has password');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);

    user = await this.usersService.updateUserPassword(userId, hashed);
    return !!user;
  }

  public async updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
    if (oldPassword === newPassword) {
      throw new BadRequestException('New password must be different from old password');
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      throw new BadRequestException('Invalid new password');
    }

    let user = await this.usersService.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password not matched!');
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(newPassword, salt);

    user = await this.usersService.updateUserPassword(userId, hashed);
    return !!user;
  }
}
