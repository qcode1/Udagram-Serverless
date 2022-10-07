
export default {
  handler: "src/lambda/s3/resizeImage/resizeImage.handler",
      events: [
        {
          sns: {
            arn: {
              "Fn::Join": [
                ":",
                [
                  "arn:aws:sns",
                  {
                    "Ref": "AWS::Region"
                  },
                  {
                    "Ref": "AWS::AccountId"
                  },
                  "${self:custom.topicName}"
                ]
              ]
            },
            "topicName": "${self:custom.topicName}"
          }
        }
      ]
};
