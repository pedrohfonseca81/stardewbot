import i18next from 'i18next';
import en from "../languages/en.json";
import pt from "../languages/pt.json";

export default i18next.init({
    lng: 'en',
    resources: {
        en: {
            translation: { ...en }
        },
        pt: {
            translation: { ...pt }
        }
    }
});