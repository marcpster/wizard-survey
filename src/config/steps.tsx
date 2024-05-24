import { Step1Schema, validateUsername } from './validation'
//@ts-ignore
import { Values, WizardValues, StepConfig } from 'react-formik-step-wizard'
import { FormikHelpers } from 'formik'
import StepEmailCheck from '../components/steps/StepEmailCheck'
import StepAsync from '../components/steps/StepAsync'
import StepFinal from '../components/steps/StepFinal'

const steps: StepConfig[] = [
  {
    id: 'StepEmail',
    title: 'Getting Your Details',
    helpText: 'Please enter your email',

    titles: {
    },
    initialValues: {
      email: ''
    },
    fields: {
      inputTypes: {
        email: 'email'
      },
      placeholders: {
        email: 'e.g. john@doe.com'
      }
    },
    disableNextOnErrors: true,

    validate: async (stepValues: Values, values: WizardValues) => {
      console.log('test2')
    
      const errors: any = {}
      if (!stepValues.email) {
        errors.email = 'Please enter your email';
        return errors;
      }

      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://api.mlops.community/v2/contact_enrichment", 
        { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_MLOPS_APP_KEY}`,
          },
          body: JSON.stringify({
            "clearbit": true,
            "apollo": true,
            "proxycurl": true,
            "email": stepValues.email
          }),
      }).catch(e => console.error('error x', e));

      // Get the JSON, if it is present
      let json: any = null;
      try {
        json = await response?.json();
      } catch (e) {
        console.log('err')
      }


      if (response?.status === 400) {
        errors.email = json && json.message;
      }
      else if (response?.status !== 200) {
        errors.email = `Invalid response: ${response?.status}`
      }

      // } else if (!stepValues.username.toLowerCase().includes(values.Step1.area.toLowerCase())) {
      //   errors.username = `Username should contain your first name (${values.Step1.area})`
      // }
      return errors
    },

    validateOnBlur: false,
    validateOnChange: false,

    onSubmit: async (stepValues: Values, _allValues: WizardValues, _actions: FormikHelpers<any>) => {
      
      console.log(stepValues)

      // const response = await fetch(
      //   "https://cors-anywhere.herokuapp.com/https://api.mlops.community/v2/contact_enrichmentx", 
      //    { 
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Authorization": `Bearer ${import.meta.env.VITE_MLOPS_APP_KEY}`,
      //     },
      //     body: JSON.stringify({
      //       "clearbit": true,
      //       "apollo": true,
      //       "proxycurl": true,
      //       "email": stepValues.email
      //     }),
      // });
      // const res = await response.json();
      // console.log(res);

      return stepValues
    }    
  },
  {
    id: 'Step1',
    title: 'General Settings',
    helpText: 'Select whether you would like to join our Slack channel and newsletter.',

    titles: {
      useSlack: 'Join Our Slack Channel',
      area: 'Area of Interest'
    },

    initialValues: {
      useSlack: true,
      useNewsletter: true,
      area: '',
      lastName: 'Doe',
      age: 30,
      email: 'mp@test.co'
    },
    // attrs defined under "fields" are for custom step renderer made
    // just for this demo folder, otherwise these aren't part of
    // the step config object
    fields: {

      inputTypes: {
        useSlack: 'checkbox',
        useNewsletter: 'checkbox',
        area: 'select',
        lastName: 'custom-text',
        age: 'number',
        email: 'email'
      },
      placeholders: {
        area: 'e.g. John',
        lastName: 'e.g. Doe',
        age: 'e.g. 18',
        email: 'e.g. john@doe.com'
      }
    },
    validationSchema: Step1Schema,
    disableNextOnErrors: true
  },
  {
    id: 'Step2',
    helpText: 'Username should include your first name. This step is to demonstrate that we can validate field based on what user typed in the previous step.',
    initialValues: {
      username: 'mrjohn',
    },
    fields: {
      inputTypes: {
        username: 'text',
      }
    },
    validate: validateUsername,
    disableNextOnErrors: true
  },
  {
    id: 'EmailCheck',
    component: <StepEmailCheck />,
    hideNext: true,
    hidePrevious: true,
    shouldSkip: (values: WizardValues, direction: number) => {
      // Skip if we click "Previous" in "StepAsync"
      if (direction === -1) {
        return true
      }
      // Skip if email has been filled
      return !!values.Step1.email
    }
  },
  {
    id: 'Async',
    component: <StepAsync />,
    onSubmit: async (stepValues: Values, _allValues: WizardValues, _actions: FormikHelpers<any>) => {
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
      await delay(2000)
      return stepValues
    }
  },
  {
    id: 'Final',
    component: <StepFinal />,
    hideNext: true,
    hidePrevious: false 
  }
]

export default steps
