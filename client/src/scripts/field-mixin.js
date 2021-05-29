import * as Validators from '../validators/validators'

export default {
    data() {
      return {
          fieldValidator: '',
          fieldValidationPattern: '',
          fieldCustomValidationMessage: '',
          fieldValid: false,
          validationText: '',
          allowZero: false,
          requiredText: 'Field is required!'
      }
    },

    methods: {
        initializeValidationProps(props) {
            this.fieldValidator = props.validator;
            this.fieldValidationPattern = props.validationPattern;
            this.fieldCustomValidationMessage = props.customValidationMessage;

            if (props.zeroAcceptable !== undefined){
                this.allowZero = props.zeroAcceptable;
            }
        },

        handleValidation(newVal) {
            let validator = this.validator.toLowerCase();
            this.fieldValid = true;
            this.validationText = ''

            if (Validators[validator] === undefined) {
                return;
            }

            if (validator === 'custom') {
                this.handleCustomValidation(newVal, validator);

                return;
            }

            if (validator === 'select'){
                this.handleSelectValidation(newVal, validator);

                return;
            }

            this.validationText = Validators[validator](newVal);

            if (this.validationText) {
                this.fieldValid = false;
            }
        },

        handleCustomValidation(newVal, validator) {
            let fieldCleared = !newVal;

            if (fieldCleared) {
                this.fieldValid = false;
                this.validationText = this.requiredText;
                return;
            }

            this.validationText = Validators[validator](newVal, this.validationPattern, this.customValidationMessage);

            if (this.validationText) {
                this.fieldValid = false;
            }
        },

        handleSelectValidation(newVal, validator) {
            this.validationText = Validators[validator](newVal, this.allowZero);

            if (this.validationText) {
                this.fieldValid = false;
            }
        }
    }
}