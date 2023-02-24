void ioread_old(FILE* file) {
    char charl;
    do {
        charl = fgetc(file);
        printf("%c", charl);
 
        // Checking if character is not EOF.
        // If it is EOF stop reading.
    } while (charl != EOF);
}

void ioread_c(int MAX_FILE_SIZE, char buffer[], FILE* fp) {
    size_t i;
    for (i = 0; i < MAX_FILE_SIZE; ++i)
    {
        int c = getc(fp);
        if (c == EOF)
        {
            buffer[i] = 0x00;
            break;
        }
        buffer[i] = c;
    }
}


void ioread_cpp(std::string filepath, std::stringstream buffer) {
    ifstream f("a.txt"); //taking file as inputstream
    std::string str;
    if(f) {
        ostringstream ss;
        ss << f.rdbuf(); // reading data
        str = ss.str();
    }
}

