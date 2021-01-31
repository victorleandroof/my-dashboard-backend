import { ConfigService } from "@nestjs/config"
import fs = require('fs');

const TYPEORM_CONFIG = 'database.config';

const generateTypeormConfigFile = (config: ConfigService) => {
  const typeormConfig = config.get(TYPEORM_CONFIG);
  fs.writeFileSync('ormconfig.json',
    JSON.stringify(typeormConfig, null, 2)
 );
}

export default generateTypeormConfigFile