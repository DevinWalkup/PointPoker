export {empty, email, custom, select};

function empty(value: any): string | null {
    if (!value) {
        return 'Field is required!';
    }
}

function email(value: any): string | null {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/

    if (!value) {
        return;
    }

    if (!regex.test(value)) {
        return 'Email is not valid!';
    }
}

function custom(value: any, pattern: string, customValidationMessage?: string) {
    let regex = RegExp(pattern);

    if (!regex.test(value)) {
        if (customValidationMessage){
            return customValidationMessage;
        }

        return 'Field is invalid'
    }
}

function select(value: any, isZeroAcceptable: boolean){
    if (!isZeroAcceptable){
        return empty(value);
    }

    if (value < 0) {
        return 'Field is required!'
    }
}