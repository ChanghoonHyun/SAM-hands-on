const AWSXRay = require('aws-xray-sdk');
const rules = {
    "rules": [{ "description": "users", "service_name": "*", "http_method": "*", "url_path": "/users/*", "fixed_target": 0, "rate": 1 }],
    "default": { "fixed_target": 1, "rate": 1 },
    "version": 1
};
AWSXRay.middleware.setSamplingRules(rules);

const AWS = AWSXRay.captureAWS(require('aws-sdk'));

// TODO: 이건 핸즈온때 제거
AWS.config.update({
    region: 'ap-southeast-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

console.log('configure container');

exports.handler = (event, context, callback) => {
    const initSubSegment = (subsegment) => {
        subsegment.addAnnotation('functionVersion', context.functionVersion);
        subsegment.addMetadata('meta', context.awsRequestId);
    };
    AWSXRay.captureFunc('annotations', initSubSegment);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    };

    if (event.queryStringParameters
        && event.queryStringParameters.error) {
        callback(new Error('raise error'));
    }

    if (event.httpMethod == 'GET') {
        const params = {
            TableName: process.env.tableName
        };
        docClient.scan(params, (err, data) => {
            const result = err
                ? [err]
                : [err, {
                    statusCode: 200,
                    body: JSON.stringify(data),
                    headers
                }];
            callback(...result);
        });
    } else if (event.httpMethod == 'POST') {
        const params = {
            TableName: process.env.tableName,
            Item: {
                id: new Date().getTime() + (event.requestContext.requestId || 'local'),
                ...JSON.parse(event.body)
            }
        };
        docClient.put(params, (err, data) => {
            const result = err
                ? [err]
                : [err, {
                    statusCode: 201,
                    headers
                }];
            callback(...result);
        });

    } else {
        callback(new Error('unknown method'));
    }
}