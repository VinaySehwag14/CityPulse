import app from './app';
import { env } from './config/env';

const { PORT } = env;

app.listen(PORT, () => {
    console.log(`[server] CityPulse API running on port ${PORT} (${env.NODE_ENV})`);
});
