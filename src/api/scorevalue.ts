import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=500';

// filter and return high-priority and solved issues with their ids
function highPrioritySolved(
    results: { id: number; created: string; updated: string; priority: string; 
        status: string; satisfaction_rating: { score: string } }[], 
    priority: string, 
    status: string 
): { matchedResults: { id: number; created: string; updated: string; satisfaction_rating: { score: string } }[] } {
    const matchedResults: { id: number; created: string; updated: string; satisfaction_rating: { score: string } }[] = [];

    for (let i = 0; i < results.length; i++) {
        if (results[i].priority == priority && results[i].status == status) {
            matchedResults.push({
                id: results[i].id,
                created: results[i].created,
                updated: results[i].updated,
                satisfaction_rating: results[i].satisfaction_rating 
              });
        }
    }
    return { matchedResults };
}

// get the score value for ticket with the longest resolution time
function findScoreValue( 
    matchedResults: { id: number; created: string; updated: string; satisfaction_rating: { score: string } }[] 
): { id: number; satisfaction_rating: { score: string } } {
    let maxTime = 0;
    let longestTicket: { id: number; satisfaction_rating: { score: string } } = {
        id: matchedResults[0].id,
        satisfaction_rating: matchedResults[0].satisfaction_rating
    };

    for (let i = 0; i < matchedResults.length; i++) {
        const createdTime = new Date(matchedResults[i].created).getTime();
        const updatedTime = new Date(matchedResults[i].updated).getTime();
        const diff = updatedTime - createdTime;
        const diffMinutes = diff / (1000 * 60); // convert to min
        if (diffMinutes > maxTime) {
            maxTime = diffMinutes
            longestTicket = {
                id: matchedResults[i].id,
                satisfaction_rating: matchedResults[i].satisfaction_rating
            };
        };
    }
    return longestTicket;
}

export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL)
    const { matchedResults } = highPrioritySolved(data.results, "high", "solved")
    const scoreValue = findScoreValue(matchedResults)
    res.json({ scoreValue });
};
