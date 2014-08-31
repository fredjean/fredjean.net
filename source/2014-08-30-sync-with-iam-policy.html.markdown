---
title: S3_Sync with AWS IAM Users and Policies
date: 2014-08-30 16:47 MDT
tags:
---

You can certainly use your AWS root account's keys to sync content up to
your S3 backed website. It will work just fine and it may be enough in
cases where you are a really small organization. It does however cause
issues when the credentials need to be shared though.

Another approach is to create a user that has the ability to manage your
bucket and it's content. This user would not have the ability to access
any other AWS APIs or resources, limiting the impact of an exposed set
of credentials.

The first step is to create the user in AWS. Login to AWS as an admin
user and go to the IAM console. Click on the Users link. Click the
"Create New Users" button.

You'll be given the opportunity to enter multiple users. Enter a user
name for your new user and make sure that the "Generate an access key
for each user" checkbox is checked. Click on the "Create" button.

This will send you to a new screen. Make sure to download the security
credentials.

You can attach a policy directly to a user, but it makes more sense to
create a group. Click on the "Groups" link and then click on "Create new
Group". Click on the "Next Step" button.

Pick the "Custom Policy" link. This will make it easier to drop in the
policies that grant access to your bucket. Click on the "Select" button.
Provide a policy name. Next, copy the following policy in the Policy
Document text field:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::fredjean.net"
    },
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::fredjean.net/*"
    }
  ]
  }
  ```

  Of course, replace ```fredjean.net``` with the name of your bucket.
  Click on the "Next Step" button.

  Verify that the information listed on the Review page matches what you
  entered and click on the "Create Group" button. This should send you
  to the Groups page and you should see your new group.

  Click on the group name. This will give you the group details page.
  Click on the "Add Users to Group" button. Select the user or users
  that need the permissions to manage your bucket. Click on the Add
  Users button.


