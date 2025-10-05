import { Router } from 'express';
import TravelController from '../controllers/travelController';
import ChatController from '../controllers/chatController';

const router = Router();
const travelController = new TravelController();
const chatController = new ChatController();

export function setRoutes(app) {
    router.get('/destinations', travelController.getDestinations.bind(travelController));
    router.post('/book-trip', travelController.bookTrip.bind(travelController));
    router.post('/chat/initiate', chatController.initiateChat.bind(chatController));
    router.post('/chat/response', chatController.getResponse.bind(chatController));

    app.use('/api', router);
}