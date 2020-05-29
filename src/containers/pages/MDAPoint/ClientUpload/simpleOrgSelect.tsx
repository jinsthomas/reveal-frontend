import { FieldProps } from 'formik';
import React from 'react';
import AsyncSelect, { Props as AsyncSelectProps } from 'react-select/async';
import { SelectOption } from '../../../../components/forms/JurisdictionSelect';
import { SELECT } from '../../../../configs/lang';
import { OPENSRP_ORGANIZATION_ENDPOINT } from '../../../../constants';
import { reactSelectNoOptionsText } from '../../../../helpers/utils';
import { OpenSRPService, URLParams } from '../../../../services/opensrp';
import { Organization } from '../../../../store/ducks/opensrp/organizations';

/** SimpleOrgSelect props */
export interface SimpleOrgSelectProps<T = SelectOption> extends AsyncSelectProps<T> {
  apiEndpoint: string /** the OpenSRP API endpoint */;
  params: URLParams /** extra URL params to send to OpenSRP */;
  serviceClass: typeof OpenSRPService /** the OpenSRP service */;
  promiseOptions: any;
}

export const promiseOptions = (service: OpenSRPService) =>
  // tslint:disable-next-line:no-inferred-empty-object-type
  new Promise((resolve, reject) => {
    service
      .list()
      .then((response: Organization[]) => {
        const options = response.map(item => {
          return { label: item.name, value: item.identifier };
        });
        resolve(options);
      })
      .catch((err: Error) => {
        reject(`Opensrp service Error ${err}`);
      });
  });

/** default props for SimpleOrgSelect */
export const defaultProps: Partial<SimpleOrgSelectProps> = {
  apiEndpoint: OPENSRP_ORGANIZATION_ENDPOINT,
  promiseOptions,
  serviceClass: OpenSRPService,
};

const SimpleOrgSelect = (props: SimpleOrgSelectProps & FieldProps) => {
  const { apiEndpoint, field, form, serviceClass } = props;

  const service = new serviceClass(apiEndpoint);

  const wrapperPromiseOptions: () => Promise<() => {}> = async () => {
    return await props.promiseOptions(service);
  };

  /**
   * onChange callback
   * unfortunately we have to set the type of option as any (for now)
   */
  const handleChange = () => (option: any) => {
    const optionVal = option as { label: string; value: string };
    if (optionVal && optionVal.value) {
      if (form && field) {
        form.setFieldValue(field.name, optionVal.value);
        form.setFieldTouched(field.name, true);
      }
    }
  };

  return (
    <div>
      <AsyncSelect
        /** we are using the key as hack to reload the component when the parentId changes */
        ref={() => 'async'}
        name={field ? field.name : 'organization'}
        bsSize="lg"
        loadOptions={wrapperPromiseOptions}
        placeholder={props.placeholder ? props.placeholder : SELECT}
        noOptionsMessage={reactSelectNoOptionsText}
        aria-label={props['aria-label'] ? props['aria-label'] : SELECT}
        onChange={handleChange()}
        defaultOptions={true}
        isClearable={true}
        cacheOptions={true}
        classNamePrefix="organization"
        {...props}
      />
    </div>
  );
};

SimpleOrgSelect.defaultProps = defaultProps;

export default SimpleOrgSelect;
