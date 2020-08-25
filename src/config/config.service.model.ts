export class ConfigServiceModel {
}

export interface Tournament {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
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

export interface LeaderBoardMetaModel {
  myPlace: LeaderBoardPlaceModel;
  title: string;
  contestants: number;
}

export interface LeaderBoardPlaceModel {
  rank: number;
  imageUrl: string;
  username: string;
  score: number;
  userId: number;
  time: number; // in seconds
}
