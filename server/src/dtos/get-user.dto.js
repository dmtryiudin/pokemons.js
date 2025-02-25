export class GetUserDto {
  constructor({ _id, ethereumIdentifier, wins }) {
    this.id = _id;
    this.ethereumIdentifier = ethereumIdentifier;
    this.wins = wins;
  }
}
