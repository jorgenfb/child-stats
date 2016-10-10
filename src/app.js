// Include as part of build pipe to enable us to do string replacement
require('file?name=index.html!./index.html');

import { IndexController } from './index.ctrl';

const controller = new IndexController();
