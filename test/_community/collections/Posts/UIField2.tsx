import { useTranslation } from 'react-i18next';
import * as React from 'react';

export const UIField2: React.FC<any> = (props) => {
    const { t, i18n } = useTranslation('custom');

    //debug
    console.log('2i18n:');
    console.dir('  2' + i18n.language); //FIXME undefined
    console.dir('  2' + i18n.options?.resources); //FIXME undefined
    console.log('    ')

    return (
        <h4>{t('loading')}</h4>
    );
}