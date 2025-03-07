import { SetMetadata } from '@nestjs/common';
import { PUBLIC_INTERNO_KEY } from '../constants/constants';

export const PublicInterno = () => SetMetadata(PUBLIC_INTERNO_KEY, true);
