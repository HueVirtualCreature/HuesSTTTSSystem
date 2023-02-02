
  
  

# Hue's STTTS System

A solution for live speech recognition and voice synthesis

⚠️ **Amazon Polly is free up to 5 million characters per month for speech or Speech Marks requests, for the first 12 months, starting from your first request for speech. 
     After that, they will probably automatically bill you. I am not responsible for any charges incurred. Read more here: https://aws.amazon.com/polly/pricing/**
  

## Usage

Access the utility here (Use Google Chrome): [https://huevirtualcreature.github.io/HuesSTTTSSystem/MicrophonePolly](https://huevirtualcreature.github.io/HuesSTTTSSystem/MicrophonePolly  "https://huevirtualcreature.github.io/HuesSTTTSSystem/MicrophonePolly")

  

### Instructions

  
  

##### AWS

This solution uses Amazon Polly as its voice synthesis service, which I believe should be free up to a few million characters per month. In order to get access to AWS Polly, you need to create an AWS account [here](https://signin.aws.amazon.com). Afterwards, follow these steps (Taken from [Here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-started-browser.html)):

###### Create an Amazon Cognito identity pool

1. Sign in to the AWS Management Console and open the Amazon Cognito console at [Amazon Web Services Console.](https://console.aws.amazon.com/cognito/)-

2. Choose **Manage Identity Pools** on the console opening page.

3. On the next page, choose **Create new identity pool**.

4. In the **Getting started wizard**, type a name for your identity pool in **Identity pool name**.

5. Choose **Enable access to unauthenticated identities**.

6. Choose **Create Pool**.

7. On the next page, choose **View Details** to see the names of the two IAM roles created for your identity pool. Make a note of the name of the role for unauthenticated identities. You need this name to add the required policy for Amazon Polly.

8. Choose **Allow**.

9. On the **Sample code** page, select the Platform of _JavaScript_. Then, copy or write down the identity pool ID and the Region. You need these values to replace REGION and IDENTITY_POOL_ID in your browser script.

After you create your Amazon Cognito identity pool, you're ready to add permissions for Amazon Polly that are needed by your browser script.

  

###### Add a Policy to the Created IAM Role

To enable browser script access to Amazon Polly for speech synthesis, use the unauthenticated IAM role created for your Amazon Cognito identity pool. This requires you to add an IAM policy to the role. For more information on IAM roles, see [Creating a Role to Delegate Permissions to an AWS Service](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html) in the _IAM User Guide_.

To add an Amazon Polly policy to the IAM role associated with unauthenticated users

  

1. Sign in to the AWS Management Console and open the IAM console at [https://console.aws.amazon.com/iam/](https://console.aws.amazon.com/iam/)

2. In the navigation panel on the left of the page, choose **Roles**.

3. In the list of IAM roles, click on the link for the unauthenticated identities role previously created by Amazon Cognito.

4. In the **Summary** page for this role, choose **Attach policies**.

5. In the **Attach Permissions** page for this role, find and then select the check box for **AmazonPollyFullAccess**.

6. Choose **Attach policy**.

After you create your Amazon Cognito identity pool and add permissions for Amazon Polly to your IAM role for unauthenticated users, you will need two pieces of information for this tool to work: AWS Region key and the AWS Credentials token. You can find this by looking at the Identity Pool ARN.

  

im sorry that this is so confusing.

  

##### Insert Credentials

When you open the tool, insert your credentials in the upper right text fields and click "Connect".

  

The keys will be saved to your cookies for this page and will be used every time you visit or reload the page.

  

##### Final Setup

Lastly, you need to allow microphone permissions when the page loads. Immediately, the Speech Recognition functionality will start. You may need to reload the page once in order to successfully load the Output Audio Devices (you can check by expanding the dropdown).

  

Feel free to play with the buttons. You can't really break anything here.
