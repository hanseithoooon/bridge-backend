import coolsms from 'coolsms-node-sdk';

class SMSSender {
    private messageService: any;

    constructor(apiKey: string, apiSecret: string) {
        this.messageService = new coolsms(apiKey, apiSecret);
    }

    async sendSMS(to: string, from: string, text: string): Promise<any> {
        try {
            const response = await this.messageService.sendOne({
                to,
                from,
                text,
            });
            return response;
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }

    async sendMultipleSMS(messages: { to: string; from: string; text: string }[]): Promise<any> {
        try{
            const response = await this.messageService.sendMany(messages);
            return response;
        } catch (error) {
            console.error('Error sending multiple SMS:', error);
            throw error;
        }
    }
}

export default SMSSender;