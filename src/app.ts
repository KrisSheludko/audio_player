import { Router } from './controller/Router/Router';
import './styles/main.scss';

class App {
    constructor() {
        new Router();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});