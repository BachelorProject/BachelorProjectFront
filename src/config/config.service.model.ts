export class ConfigServiceModel {
}

export interface Tournament {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  registrationEnd: number;
  nextContestStart: number;
  nextContestDuration: number; // minutes
  subjects: Subject[];
  registeredCount: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  newUser: boolean;
  currentUser: CurrentUserInformation;
}

export interface Subject {
  id: number;
  name: string;
  colorId: number;
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
  status: string; //   'UNPUBLISHED', 'REGISTRATION ON', 'REGISTRATION OVER', 'ONGOING', 'CANCELLED', 'COMPLETED'
  isRegistered: boolean;
  createUser: number;
}

export interface ContestRound {
  id: number;
  isClosed: boolean;
  duration: number;
  placeToPass: number; // -1 means this is not passing criteria
  pointsToPass: number; // -1 means this is not passing criteria
  status: string; //   'ACTIVE', 'ONGOING', 'CANCELLED', 'COMPLETED'
  startTime: number;
  password: '';
}

export interface ContestQuestion {
  question: string;
  options: string[];
  score: number;
  type: string; // 'MULTIPLE CHOICE', 'ONE CHOICE'
  correctAnswer: number[];
}

export interface CurrentUserInformation {
  userId: number;
  profileImageUrl: string;
}

export interface UserInformation {
  userId: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthDay: number; // timestamp
  education: string;
  username: string;
  profileImageUrl: string;
  email: string;
  subjects: SubjectStat[];
}

export interface SubjectStat {
  subjectId: number;
  subjectStats: SubjectStatEntry[];
}

export interface SubjectStatEntry {
  timestamp: number;
  score: number;
}

export interface PastContest {
  imageUrl: string;
  title: string;
  subjectIds: number[];
  contestId: number;
}
