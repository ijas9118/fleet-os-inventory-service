import "reflect-metadata";

import createApp from "./app";
import logger from "./config/logger";
import env from "./config/validate-env";

const app = createApp();

const PORT = env.PORT || 3003;

(async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Inventory Server started on port ${PORT}`);
    });
  }
  catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
})();
