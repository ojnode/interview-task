import axios from 'axios';
import { Request, Response } from 'express';
import { SampleData } from './types';

const DATA_URL = 'https://sampleapi.squaredup.com/integrations/v1/service-desk?datapoints=100';


export const GET = async (req: Request, res: Response) => {
    const { data } = await axios.get<SampleData>(DATA_URL);
    const sortedData = data.results.sort((a, b) => {
        const priorityOrder: { [key: string]: number } = { low: 1, normal: 2, high: 3 };
        return (priorityOrder[b.priority]) - (priorityOrder[a.priority]);
    });
    res.json({ sortedData });
};

