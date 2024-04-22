// chatGPT.test.js
const OpenAI = require("openai");
const integrationChatGPT = require("./chatgpt");

jest.mock('openai', () => {
    return jest.fn().mockImplementation(() => {
        return {};
    });
})

describe("ChatGPT Integration", () => {
    it("should call telegraf command", async () => {
        const bot = {
            command: jest.fn(),
            test: jest.fn(),
        };
        integrationChatGPT(bot);
        expect(bot.command).toBeCalledTimes(1);
    });
});
