const WeatherSchema = {
  name: 'Weather',
  primaryKey: 'id',
  properties: {
    id: {type: 'int', indexed: true},
    name: 'string',
    temp: 'float',
    icon: 'string',
  },
};
export default WeatherSchema;

