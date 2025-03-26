import random
import string

def generate_alphanumeric(length=24):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))

def main():
    random_string = generate_alphanumeric()
    print("Generated 24 character alphanumeric string : ", random_string)

main()
