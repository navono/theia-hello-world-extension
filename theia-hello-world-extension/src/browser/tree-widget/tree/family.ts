export interface Family {
  name: string;
  members: Member[];
}

export interface Member {
  firstName: string;
  nickName: string;
  children?: Member[];
}
