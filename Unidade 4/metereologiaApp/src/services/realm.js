import Realm from 'realm';
import WeatherSchema from '../schemas/WeatherSchema';

export default function getRealm() {
  return Realm.open({
    schema: [WeatherSchema],
  });
}
