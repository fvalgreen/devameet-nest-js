import { IsBoolean } from 'class-validator';
import { RoomMessageHelper } from '../helpers/room.messages.helper';
import { JoinRoomDto } from './joinroom.dto';

export class toglMuteDto extends JoinRoomDto{
  @IsBoolean({ message: RoomMessageHelper.MUTE_NOT_VALID })
  muted: boolean;
}
