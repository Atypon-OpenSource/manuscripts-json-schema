import {generateValidators} from "./generateValidators";
import {generateDefinitions} from "./generateDefinitions";
import {generateTypeLookups} from "./generateTypeLookups";

async function main() {
    await generateValidators();
    await generateDefinitions();
    await generateTypeLookups();
}

main().catch(e => console.log(e));