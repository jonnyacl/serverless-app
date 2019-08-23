# FRACTAL DEV PORTAL API

Serverless (https://serverless.com) project to create the API the Fractal Developer Portal uses to create, delete and modify apps. It also allows developers to request access to the live APIs.

The Dev portal uses Cognito for user authentication and management. In order to give the logged in user access to the API via Cognito, the ```cognito.yml``` file defines the lambdas that cognito triggers on login/signup. These lambdas create and provide access tokens through cognito to the dev portal app allowing a logged in user access to the other dev portal API endpoints.

## Endpoints
* ```GET /user/apps``` - retrieve all apps for a user
* ```POST /user/apps``` - user triggered app creation
* ```PUT /user/apps/{appId}``` - user triggered app modification, including requesting access to different APIs
* ```DELETE /user/apps/{appId}``` - user triggered app deletion
* ```POST /user/partner``` - user submitting their partner name, which must then be verified by an admin

## Creating a new API
When a new Fractal partner API - both live and sandbox - is created, the app lambdas need to be modified to grant app access to these APIs.

For now, modify the ```editApp.py``` ```edit_app``` function, adding an if clause for the new API:
```
if app_info['api'] == <API>:
    print('Updating app ' + app_id + ' <API> status to ' + new_status)
    return table.update_item(
        Key={'appId': app_id},
        AttributeUpdates={
            app_<API>_status_col: {'Value': new_status}
        },
    )
```
Replacing the ```<API>``` with the new API name.

This will modify the API status column in the app to pending or revoked.

When this is done, the Dev Portal FE project will need to be modified to display the new API with its status in the App details page.

For new sandbox APIs, all sandbox apps are auto-authorised to access these plans.

Modify ```createApp.py``` , in ```create_app``` function, add to the ```if can_create``` clause:

```
<app>_status = "Auto-authorised"
api_gw_client.create_usage_plan_key(
    usagePlanId=os.environ['SB_<API>_USAGE_PLAN'],
    keyId=api_key['id'],
    keyType='API_KEY'
)

```

Add the usage plan id for the new API as an environment variable in ```adminEditApps.yml```:

```
editAdminApp:
  ...
  environment:
    ...
    LIVE_<API>_USAGE_PLAN: ${opt:<api>Plan}
    SB_<API>_USAGE_PLAN: ${opt:<api>SBPlan}
```
Where ```opt:``` is the serverless way to define a command line parameter. In ```.gitlab-ci.yml``` the usage plan ID must be added to the deploy script for each environment:
```
sls deploy ... --<api>Plan <plan_id> --<api>SBPlan <sandbox_plan_id>
```

### @todo
Make the functions generic for some list of APIs

## Installing Serverless 

Taken from https://serverless.com/framework/docs/providers/aws/guide/installation

Requires Node and npm - see https://nodejs.org/en/download/package-manager

To install ```npm install -g serverless```
Then install this aws serverless plugin ```npm install serverless-aws-documentation --save-dev``` This plugin is needed for each serverless project and is added locally in the node_modules

Once the installation process is done you can verify that Serverless is installed successfully by running the following command in your terminal ```serverless```

To see which version of serverless you have installed run ```serverless --version```

To run: ```sls deploy```

To remove: ```sls remove```

## Serverless YAML

https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/

This describes all the options for how the serverless.yml files configures the deploy

## AWS Policy for using serverless deploy

```
{
    "Statement": [
        {
            "Action": [
                "apigateway:*",
                "cloudformation:CancelUpdateStack",
                "cloudformation:ContinueUpdateRollback",
                "cloudformation:CreateChangeSet",
                "cloudformation:CreateStack",
                "cloudformation:CreateUploadBucket",
                "cloudformation:DeleteStack",
                "cloudformation:Describe*",
                "cloudformation:EstimateTemplateCost",
                "cloudformation:ExecuteChangeSet",
                "cloudformation:Get*",
                "cloudformation:List*",
                "cloudformation:PreviewStackUpdate",
                "cloudformation:UpdateStack",
                "cloudformation:UpdateTerminationProtection",
                "cloudformation:ValidateTemplate",
                "dynamodb:CreateTable",
                "dynamodb:DeleteTable",
                "dynamodb:DescribeTable",
                "ec2:AttachInternetGateway",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateInternetGateway",
                "ec2:CreateNetworkAcl",
                "ec2:CreateNetworkAclEntry",
                "ec2:CreateRouteTable",
                "ec2:CreateSecurityGroup",
                "ec2:CreateSubnet",
                "ec2:CreateTags",
                "ec2:CreateVpc",
                "ec2:DeleteInternetGateway",
                "ec2:DeleteNetworkAcl",
                "ec2:DeleteNetworkAclEntry",
                "ec2:DeleteRouteTable",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteSubnet",
                "ec2:DeleteVpc",
                "ec2:Describe*",
                "ec2:DetachInternetGateway",
                "ec2:ModifyVpcAttribute",
                "events:DeleteRule",
                "events:DescribeRule",
                "events:ListRuleNamesByTarget",
                "events:ListRules",
                "events:ListTargetsByRule",
                "events:PutRule",
                "events:PutTargets",
                "events:RemoveTargets",
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:DeleteRolePolicy",
                "iam:GetRole",
                "iam:PassRole",
                "iam:PutRolePolicy",
                "iot:CreateTopicRule",
                "iot:DeleteTopicRule",
                "iot:DisableTopicRule",
                "iot:EnableTopicRule",
                "iot:ReplaceTopicRule",
                "kinesis:CreateStream",
                "kinesis:DeleteStream",
                "kinesis:DescribeStream",
                "lambda:*",
                "logs:CreateLogGroup",
                "logs:DeleteLogGroup",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:FilterLogEvents",
                "logs:GetLogEvents",
                "s3:CreateBucket",
                "s3:DeleteBucket",
                "s3:DeleteBucketPolicy",
                "s3:DeleteObject",
                "s3:DeleteObjectVersion",
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:ListAllMyBuckets",
                "s3:ListBucket",
                "s3:PutBucketNotification",
                "s3:PutBucketPolicy",
                "s3:PutBucketTagging",
                "s3:PutBucketWebsite",
                "s3:PutEncryptionConfiguration",
                "s3:PutObject",
                "sns:CreateTopic",
                "sns:DeleteTopic",
                "sns:GetSubscriptionAttributes",
                "sns:GetTopicAttributes",
                "sns:ListSubscriptions",
                "sns:ListSubscriptionsByTopic",
                "sns:ListTopics",
                "sns:SetSubscriptionAttributes",
                "sns:SetTopicAttributes",
                "sns:Subscribe",
                "sns:Unsubscribe",
                "states:CreateStateMachine",
                "states:DeleteStateMachine"
            ],
            "Effect": "Allow",
            "Resource": "*"
        }
    ],
    "Version": "2012-10-17"
}
```