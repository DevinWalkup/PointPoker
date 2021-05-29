import {reactive} from 'vue'
import { v4 as uuidv4 } from 'uuid';

export interface AlertContent {
    Id: String,
    AlertType: String,
    Content: String,
    List: Array<String>
}

const ALERT_AUTO_DISMISS_TIMEOUT = 5000

class AlertStore {
    private state;

    constructor() {
        this.state = reactive({
            alerts: []
        })
    };

    get alerts() {
        return this.state.alerts;
    }

    public warning(response){
        this.constructAlert(response, 'warning');
    }

    public error(response){
        this.constructAlert(response, 'error');
    }

    public success(response) {
        this.constructAlert(response, 'success');
    }

    private constructAlert(response, alertType : string) {
        let message = response.message;
        let list = [];

        if (response.fields){
            response.fields.map((field) => {
                list.push(field);
            })
        }

        let alert : AlertContent = {
            Id: uuidv4(),
            AlertType: alertType,
            Content: message,
            List: list
        };

        this.state.alerts.push(alert);

        window.scrollTo({top: 0, behavior: 'smooth'});

        setTimeout(() => {
            this.removeAlert(alert)
        }, ALERT_AUTO_DISMISS_TIMEOUT)
    }

    public removeAlert(alert : AlertContent) {
        let alerts = this.alerts;

        let alertToRemove = alerts.indexOf(alerts.filter(a => a.Id === alert.Id)[0])

        if (alertToRemove === -1){
            return;
        }

        this.state.alerts.splice(alertToRemove, 1);
    }
}

export {AlertStore}
export default new AlertStore()