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
  subjects: Subject[];
  registeredCount: number;
}

export interface AuthResponse {
  success: string;
  token: string;
  newUser: string;
}

export interface Subject {
  id: number;
  name: string;
  color_id: number;
}
