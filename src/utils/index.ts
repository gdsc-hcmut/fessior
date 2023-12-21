import { Types } from 'mongoose';
import { CreateDto, Origin } from 'src/constants/types';

export const toOrigin = {
  'https://l.messenger.com/': Origin.MESSENGER,
  'https://l.facebook.com/': Origin.FACEBOOK,
  'https://l.instagram.com/': Origin.INSTAGRAM,
  'https://t.co/': Origin.TWITTER,
  'https://www.linkedin.com/': Origin.LINKEDIN,
  'https://www.youtube.com/': Origin.YOUTUBE,
};

export function getOrigin(referer: string): string {
  if (referer === 'https://l.messenger.com/') {
    return 'Messenger';
  }
  if (referer === 'https://l.facebook.com/') {
    return 'Facebook';
  }
  if (referer === 'https://l.instagram.com/') {
    return 'Instagram';
  }
  if (referer === 'https://t.co/') {
    return 'Twitter';
  }
  if (referer === 'https://www.linkedin.com/') {
    return 'Linkedin';
  }
  if (referer === 'https://www.youtube.com/') {
    return 'Youtube';
  }
  return '';
}

export function injectUserId(dto: CreateDto, userId: Types.ObjectId): void {
  dto.createdBy = userId;
  dto.updatedBy = userId;
}
