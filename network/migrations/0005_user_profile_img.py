# Generated by Django 5.1 on 2024-09-02 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_remove_user_profile_img'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='profile_img',
            field=models.ImageField(blank=True, null=True, upload_to='profile/'),
        ),
    ]
