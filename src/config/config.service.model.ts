export class ConfigServiceModel {
}

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

export interface Contest {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  registrationEnd: number;
  subjectIds: number[];
  status: string; //   'UNPUBLISHED', 'REGISTRATION_ON', 'REGISTRATION_OVER', 'ONGOING', 'CANCELLED', 'COMPLETED'
  rounds: ContestRound[];
}

export interface ContestRound {
  strictMode: boolean;
  isOpen: boolean;
  duration: number;
  placeToPass: number; // -1 means this is not passing criteria
  pointsToPass: number; // -1 means this is not passing criteria
  questions: ContestQuestion[];
  status: string; //   'ACTIVE', 'ONGOING', 'CANCELLED', 'COMPLETED'
  startTime: number;
}

export interface ContestQuestion {
  question: string;
  options: string[];
  score: number;
  type: string; // 'MULTIPLE_CHOICE', 'ONE_CHOICE'
}
