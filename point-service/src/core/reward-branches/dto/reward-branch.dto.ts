import {Reward} from "../../rewards/entity/rewards.entity";

export class RewardBranchDto {
  id: number;
  isAvailable: boolean;
  branch: any;
  reward: Reward;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
