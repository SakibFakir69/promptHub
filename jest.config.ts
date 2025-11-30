

import type {Config} from  'jest';


export const config:Config={
    preset:'ts-jest',
    testEnvironment:'node',
    testMatch:['**/test/**/*.test.ts']

}