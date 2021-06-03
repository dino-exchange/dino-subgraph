/* eslint-disable prefer-const */
import { BigDecimal } from "@graphprotocol/graph-ts";
import { concat } from "@graphprotocol/graph-ts/helper-functions";
import { User, Referee } from "../../generated/schema";
import {
  Referral,
  ReferralPaid
} from "../../generated/DinoDens/DinoDens";

let ZERO_BD = BigDecimal.fromString("0");
let EIGHTEEN_BD = BigDecimal.fromString("1e18");

export function handleReferral(event: Referral): void {
  let user = User.load(event.params._user.toString());
  if (user === null) {
    user = new User(event.params._user.toString());
    user.referrer = event.params._referrer;
    user.save();
  }
  let refereeId = concat(event.params._referrer, event.params._user).toHex();
  let referee = Referee.load(refereeId);
  if (referee === null) {
    referee = new Referee(refereeId);
    referee.referrer = event.params._referrer.toString();
    referee.address = event.params._user;
    referee.amount = ZERO_BD;
    referee.createdAt = event.block.timestamp;
    referee.updatedAt = event.block.timestamp;
    referee.save();
  }
}

export function handleReferralPaid(event: ReferralPaid): void {
  let user = User.load(event.params._user.toString());
  if (user === null) {
    user = new User(event.params._user.toString());
    user.referrer = event.params._userTo;
    user.save();
  }
  let refereeId = concat(event.params._userTo, event.params._user).toHex();
  let referee = Referee.load(refereeId);
  if (referee === null) {
    referee = new Referee(refereeId);
    referee.referrer = event.params._userTo.toString();
    referee.address = event.params._user;
    referee.amount = ZERO_BD;
    referee.createdAt = event.block.timestamp;
  }
  referee.amount = referee.amount.plus(event.params._reward.divDecimal(EIGHTEEN_BD));
  referee.updatedAt = event.block.timestamp;
  referee.save();
}
