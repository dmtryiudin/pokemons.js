export class GetPokemonDto {
  constructor({ id, name, type, base, image }) {
    this.id = id;
    this.name = name.english;
    this.type = type;
    this.HP = base.HP;
    this.Attack = base.Attack;
    this.Defense = base.Defense;
    this.Speed = base.Speed;
    this.image = image.hires;
  }
}
