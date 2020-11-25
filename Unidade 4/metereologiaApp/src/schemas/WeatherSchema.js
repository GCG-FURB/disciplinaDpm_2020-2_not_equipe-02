const WeatherSchema = {
  name: 'Weather',
  primaryKey: 'id',
  properties: {
    id: {type: 'int', indexed: true},
    name: 'string',
    temp: 'float',
  },
};
export default WeatherSchema;

