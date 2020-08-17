export class ConfigServiceModel{}

export interface Tournament {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  registrationStart: number;
  registrationEnd: number;
  nextContestStart: number;
  nextContestDuration: number;
  category: string;
}

export interface AuthResponse {
  success: string;
  token: string;
  newUser: string;
}
