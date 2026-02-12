import { exit } from 'node:process';
import { PrismaClient } from './config/prisma/client';
import { log } from './utils/log';
import { config } from './config/config';

export const initialize = async (): Promise<void> => {
    const prisma = new PrismaClient({ accelerateUrl: config.logLevel });

    try {
        throw new Error('Testowy błąd inicjalizacji'); // Usunąć lub zakomentować ten wiersz po przetestowaniu logowania błędów
        await prisma.$transaction(async (p) => {
            // Sprawdzenie połączenia z bazą danych
        });
    } catch (error) {
        log(`Error during initialization: ${error}`, 'ERROR');
        exit(1);
    }
};
