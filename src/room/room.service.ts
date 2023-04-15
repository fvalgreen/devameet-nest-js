import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meet, MeetDocument } from 'src/meet/schemas/meet.schema';
import {
  MeetObject,
  MeetObjectDocument,
} from 'src/meet/schemas/meetobject.schema';
import { Position, PositionDocument } from './schemas/position.schema';
import { UserService } from 'src/user/user.service';
import { RoomMessageHelper } from './helpers/room.messages.helper';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { toglMuteDto } from './dtos/toglMute.dto';

@Injectable()
export class RoomService {
  private logger = new Logger(RoomService.name);

  constructor(
    @InjectModel(Meet.name) private readonly meetModel: Model<MeetDocument>,
    @InjectModel(MeetObject.name)
    private readonly objectModel: Model<MeetObjectDocument>,
    @InjectModel(Position.name)
    private readonly positionModel: Model<PositionDocument>,
    private readonly userService: UserService,
  ) {}

  async getRoom(link: string) {
    this.logger.debug(`getRoom - ${link}`);

    const meet = await this._getMeet(link);
    const objects = await this.objectModel.find({ meet });
    return {
      link,
      name: meet.name,
      color: meet.color,
      objects,
    };
  }

  async listUsersPositionByLink(link: string) {
    this.logger.debug(`listUsersPositionByLink - ${link}`);

    const meet = await this._getMeet(link);
    return await this.positionModel.find({ meet });
  }

  async deleteUsersPosition(clientId: string) {
    this.logger.debug(`deleteUsersPosition - ${clientId}`);

    return await this.positionModel.deleteMany({ clientId });
  }

  async updateUserPosition(clientId: string, dto: UpdateUserPositionDto) {
    this.logger.debug(`updateUserPosition - ${dto.link}`);

    const meet = await this._getMeet(dto.link);
    const user = await this.userService.getUserById(dto.userId);
    if (!user) {
      throw new BadRequestException(RoomMessageHelper.JOIN_USER_NOT_VALID);
    }

    const position = {
      ...dto,
      clientId,
      user,
      meet,
      name: user.name,
      avatar: user.avatar,
    };

    const usersInRoom = await this.positionModel.find({ meet });
    if (usersInRoom && usersInRoom.length > 10) {
      throw new BadRequestException(RoomMessageHelper.ROOM_MAX_USERS);
    }

    const loggedUserInRoom = usersInRoom.find(
      (u) =>
        u.user.toString() === user._id.toString() || u.clientId === clientId,
    );

    if (loggedUserInRoom) {
      await this.positionModel.findByIdAndUpdate(
        { _id: loggedUserInRoom._id },
        position,
      );
    } else {
      if (usersInRoom && usersInRoom.length > 10) {
        throw new BadRequestException(RoomMessageHelper.ROOM_MAX_USERS);
      }

      await this.positionModel.create(position);
    }
  }

  async updateUserMute(dto: toglMuteDto) {
    this.logger.debug(`updateUserMute - ${dto.link} - ${dto.userId}`);

    const meet = await this._getMeet(dto.link);
    const user = await this.userService.getUserById(dto.userId);

    await this.positionModel.updateMany({ user, meet }, { muted: dto.muted });
  }

  async _getMeet(link: string) {
    const meet = await this.meetModel.findOne({ link });
    if (!meet) {
      throw new BadRequestException(RoomMessageHelper.JOIN_LINK_NOT_VALID);
    }

    return meet;
  }
}
