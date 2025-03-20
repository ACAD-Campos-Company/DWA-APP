import { GenericData, GenericListResult } from "./generic-data.model";
import { User } from "./users.model";
export interface ChallengeData extends GenericListResult {
    data: Data;
}

export interface Data {
    challenges: Challenge[];
}

export interface todayChallengeData extends GenericData {
    data: Challenge[];
}

export interface dataChallenge extends GenericData {
    data: Challenge;
}

export interface Challenge {
    id: number;
    challenge_id: number;
    changes: Challenge;
    name: string;
    description: string;
    image: string;
    points: number;
    active: boolean;
    difficulty: string;
    weekDay: string;
    startDate: string;
    endDate: string;
    created_at: string;
    updated_at: string;
    completed: boolean;
    user_challenges: UserChallenge[];
} 

export interface UserChallenge extends User {
    id: number;
    user_id: number;
    challenge_id: number;
    image: string | null;
    comment: string | null;
    completed_date: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
    first_name: string;
    username: string;
    document: string;
    challenge_name: string;
    points: number;
    description: string;
}