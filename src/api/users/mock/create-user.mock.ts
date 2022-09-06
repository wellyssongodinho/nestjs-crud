import { CreateUserDto } from '../dto/create-user.dto';

export class createUserMock extends CreateUserDto {
  name = 'Mock';
  email = 'mock@example.com';
  password = 'password';
  constructor(name?, email?, password?) {
    super();
    this.name = name ? name : this.name;
    this.email = email ? email : this.email;
    this.password = password ? password : this.password;
  }
}
