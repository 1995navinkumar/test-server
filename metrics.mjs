import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client';
export const pcRegistryInstance = new Registry();

const prefixMetricNameWithAppName = (metricName) => {
  return `node_app_${metricName}`;
};

collectDefaultMetrics({
  register: pcRegistryInstance,
  prefix: prefixMetricNameWithAppName('default_metrics_'),
});

export const createHistogram = ({
  metricName,
  metricDesc,
  possibleLabels = [],
}) => {
  const histogram = new Histogram({
    name: prefixMetricNameWithAppName(metricName),
    help: metricDesc,
    labelNames: possibleLabels,
    buckets: [5, 50, 100, 200, 400, 600, 800, 1000, 1200, 1500, 2000, 10000],
  });
  pcRegistryInstance.registerMetric(histogram);
  return histogram;
};

export const createCounter = ({
  metricName,
  metricDesc,
  possibleLabels = [],
}) => {
  const counter = new Counter({
    name: prefixMetricNameWithAppName(metricName),
    help: metricDesc,
    labelNames: possibleLabels,
  });
  pcRegistryInstance.registerMetric(counter);
  return counter;
};

export const metricApi = async (req, res) => {
  // console.log("metrics api called");
  res.setHeader('Content-Type', pcRegistryInstance.contentType);
  res.send(await pcRegistryInstance.metrics());
};

export const responseTimeHistogram = createHistogram({
  metricName: 'response_time',
  metricDesc: 'Request latency',
  possibleLabels: ['statusCode'],
});

export const requestCounter = createCounter({
  metricName: 'request_count',
  metricDesc: 'Total request received',
  possibleLabels: ['path', 'method'],
});
