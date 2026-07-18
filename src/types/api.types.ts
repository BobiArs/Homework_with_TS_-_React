export interface PostDTO {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface UserDTO {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
