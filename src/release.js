#!/usr/local/bin/node
const child_process = require('child_process')
const fs = require('fs')
const process = require('process')
const crypto = require('crypto')


/* mcc main.crown */
const args = process.argv.slice(2)
let infile
let outfile
let cc
let cc_attr = ''
let is_debugging = false
let flag
let outfile_lState
let struct_name
let COMPILERX_STDOUT_varname
let COMPILERX_STDIN_varname
let FILEREAD_anonymous_id
let IOREAD_BUFFER

if (process.argv.length > 2) {
    infile = args[0]
    outfile = infile.replace(".crown",".c")
}


/* Built-in libraries */
function BuiltInLibs() {
    let res = `
// Fatorial
int fat(int n)  // retorna um int, argumento é de tipo int
{
    int i, fat ;
    
    if (n <= 1) {
        // por definição
        return (1);
    }      
    
    fat = 1 ;
    for (i=2; i <= n; i++) {
        fat *= i ;
    }
    return (fat) ;
}

// Lower-Uppercase String Handling
char* toLower(char* s) {
    for(char *p=s; *p; p++) *p=tolower(*p);
    return s;
}
char* toUpper(char* s) {
    for(char *p=s; *p; p++) *p=toupper(*p);
    return s;
}

void substring(char s[], char sub[], int p, int l) {
    int c = 0;
    
    while (c < l) {
       sub[c] = s[p+c-1];
       c++;
    }
    sub[c] = '\\0';
}

int beginsWith(char str1[], char str2[]) {
    for(int i=0; i<strlen(str2); i++) {
        if (str1[i] == str2[i]) {
            continue;
        } else {
            return 0;
        }
    }
    return 1;
}
int indexOf(char str[], char character[]) {
    for (int i=0;i<strlen(str);i++) {
        if(beginsWith(&str[i], character)) {
            return i;
        }
    }
    return -1;
}


`
    return res;
}

/* Indent */
let tabl = ''

/* Fusion Manpage */
function Help() {
    console.log("\n                   CROWN PROGRAMMING LANGUAGE                 ")
    console.log("------------------------------------------------------------------------")
    console.log("Compile source-code:       crown <source_code>.crown")
    console.log("------------------------------------------------------------------------\n\n")
    //console.log("\nGCC and Clang Care also supported!\n")
    //console.log("------------------------------------------------------------------------\n\n")
}
/* Compile source-code */
function __Compile() {
    let regex = /[A-Za-z0-9_$++::.,@*#><>=<=>===:=\[\]]+|"[^"]+"|"[^"]+"|\([^)]*\)|\[[^\]]*\]|(:)|(=)/g
    let source = fs.readFileSync(infile,'utf8')
   
    source.split(/\r?\n/).forEach(line =>  {
        let stack = line.match(regex)

        /**
         * @error  stack.lenght
         * @fix    stack?.length
         */
        console.log("Lines:")
        console.log(" ->"+stack+" ")
        for (let i = 0; i < stack?.length; i++) {
            process.stdout.write("Token: ["+stack[i]+"] ~ ")

            if (stack[i] == 'using' && stack[i+1] == 'crown') {
                fs.writeFileSync(outfile,"#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <stdbool.h>\n#include <ctype.h>\n\n")
                fs.appendFileSync(outfile, BuiltInLibs())
            }
            if (stack[i] == 'using') {
                if (stack[i+1] == 'gcc') {
                    cc = 'gcc'
                    flag = '-o'
                    outfile_lState = outfile.replace(".c","")
                }
                if (stack[i+1] == 'clang') {
                    cc = 'clang'
                    flag = '-o'
                    outfile_lState = outfile.replace(".c","")
                }
                if (stack[i+1] == 'tinycc') {
                    cc = 'tcc'
                    flag = '-o'
                    outfile_lState = outfile.replace(".c","")
                }
                if (stack[i+1] == 'tinycc_vm') {
                    cc = 'tcc'
                    flag = '-run'
                    outfile_lState = outfile.replace(".c","")
                }
                if (stack[i+1] == 'lua') {
                    if (process.platform === "darwin") {
                        //flag = '-I -L -llua -ldl -lm -shared -fpic -o'
                        flag = '-bundle -undefined dynamic_lookup -fpic -o'
                        outfile_lState = outfile.replace(".c",".so")

                    } else if (process.platform === "win32") {
                        //flag = ''
                        //outfile_lState = outfile.replace(".c",".dll")
                    } else {
                        // Linux
                        flag = '-shared -fpic -o'
                        outfile_lState = outfile.replace(".c",".so")
                    }
                }
                if (stack[i+1] == 'static') {
                    flag = '-static -o'
                }
                if (stack[i+1] == 'debugging') {
                    is_debugging = true
                }
                if (stack[i+1] == 'tokenizer') {
                    fs.appendFileSync(outfile,`
size_t split_token(char *buffer, char *argv[], size_t argv_size) {
    char *p, *start_of_word;
    int c;
    enum states { DULL, IN_WORD, IN_STRING } state = DULL;
    size_t argc = 0;
                    
    for (p = buffer; argc < argv_size && *p != '\\0'; p++) {
        c = (unsigned char) *p;
        switch (state) {
        case DULL:
            if (isspace(c)) {
                continue;
            }
                    
            if (c == '"') {
                    state = IN_STRING;
                    start_of_word = p + 1; 
                    continue;
            }
                    
                                /*if (c == '(') {
                                    state = IN_STRING;
                                    start_of_word = p + 1; 
                                    continue;
                                }
                                if (c == '[') {
                                    state = IN_STRING;
                                    start_of_word = p + 1; 
                                    continue;
                                }*/
            state = IN_WORD;
            start_of_word = p;
            continue;
                    
            case IN_STRING:
                    if (c == '"') {
                        *p = 0;
                        argv[argc++] = start_of_word;
                        state = DULL;
                    }
                                /*if (c == ')') {
                                    *p = 0;
                                    argv[argc++] = start_of_word;
                                    state = DULL;
                                }
                                if (c == ']') {
                                    *p = 0;
                                    argv[argc++] = start_of_word;
                                    state = DULL;
                                }*/
                    continue;
                    
                    case IN_WORD:
                        if (isspace(c)) {
                            *p = 0;
                            argv[argc++] = start_of_word;
                            state = DULL;
                        }
                                continue;
                    }
            }
                    
            if (state != DULL && argc < argv_size)
                argv[argc++] = start_of_word;
                    
            return argc;
    }
`)
                }
            }
            // End block
            if (stack[i] == 'end') {
                fs.appendFileSync(outfile,'};\n')
                //
                
            }
            if (stack[i] == 'do') {
                fs.appendFileSync(outfile,'{\n')
                //
                
            }

            // Comentarios
            if (stack[i] == '#') {
                fs.appendFileSync(outfile, '/* '+stack[i+1].slice(1,-1)+' */\n')
                //fs.appendFileSync(outfile,'/* '+line.replace('#'+' ','')+' */\n')
            }
                

            // Declaração de variaveis e vetores
            if (stack[i] == '=') {
                let vartype = stack[i-2]
                let varname = stack[i-1]
                let value
                let optional_parameter

                /* It has value for variable */
                if (stack[i+1] != 'null') {
                    value = stack[i+1]
                    /** String handling */
                    value = value.replace('String.len', 'strlen')
                    value = value.replace('String.lowercase','toLower')
                    value = value.replace('String.uppercase','toUpper')
                    value = value.replace('String.reverse','strrev')


                    /**
                     *      # First mode
                     *      *String a = "Hello world"
                     *      *String b = String.assign(a)
                     * 
                     *      # Second mode
                     *      String.assign(b,a)
                     */
                    value = value.replace('String.assign','strdup')
                    
                    
                    /** String compare */
                    /** EQUALS:
                     * equals a and b do
                     *      ...
                     * elsequals b and c do
                     *      ...
                     * else
                     *      ...
                     * end
                     * 
                     * 
                     * STRING.ISEQUAL:
                     * 
                     * *String e = String.isEqual(a,b)
                     * *String d = String.isEqual(b,c)
                     * 
                     * if (e == true) {
                     *      ...
                     * } elseif (d == true) {
                     *      ...
                     * } else {
                     *      ...
                     * }
                    */
                    value = value.replace('String.isEqual','strcomp')
                    value = value.replace('String.slice','strtok')

                    


                    /** Additional arguments */
                    optional_parameter = stack[i+2]
                    if (optional_parameter == undefined) { optional_parameter = ''}

                    //if vartype == 'Integer' or varname == 'Double' or varname == 'String' or varname == 'Boolean':
                    if (vartype.includes('[]')) {
                        vartype = vartype.replace('int[]','int')
                        vartype = vartype.replace('float[]','float')
                        vartype = vartype.replace('String[]','char*')
                        vartype = vartype.replace('*String[]','char*')
                        vartype = vartype.replace('bool[]','boolean')

                        let res
                        if (varname.includes('[') && varname.includes(']')) {
                            res = `${tabl}${vartype} ${varname} = {${value.slice(1,-1)}};\n`
                            res = res + `${vartype} ${varname.slice(0,varname.indexOf('['))}_size = sizeof(${varname.slice(0,varname.indexOf('['))})/sizeof(${varname.slice(0,varname.indexOf('['))}[0]);\n`
                        } else {
                            res = `${tabl}${vartype} ${varname}[] = {${value.slice(1,-1)}};\n`
                            res = res + `${vartype} ${varname}_size = sizeof(${varname})/sizeof(${varname}[0]);\n`
                        }
                        fs.appendFileSync(outfile,res)
                    
                    } else {
                        if (vartype == 'mathematical') {
                            vartype = vartype.replace('mathematical','')
                            let res = `${tabl}float ${varname} = ${value.slice(1,-1)}${optional_parameter};\n`
                            fs.appendFileSync(outfile,res)
                        } else {
                            let res
                            //let vec_initial_state = '[]'
                            if (vartype == 'String') {
                                vartype = 'char'
                                /* Transcription */
                                if (varname.includes("[") && varname.includes("]")) {
                                    res = `${tabl}${vartype} ${varname} = ${value}${optional_parameter};\n`
                                    
                                } else {
                                    res = `${tabl}${vartype} ${varname}[] = ${value}${optional_parameter};\n`
                                    
                                }
                                fs.appendFileSync(outfile,res)
                                
                            } else if (vartype == '*String') {
                                vartype = 'char*'
                                /* Transcription */
                                res = `${tabl}${vartype} ${varname} = ${value}${optional_parameter};\n`
                                fs.appendFileSync(outfile,res)
                                
                            } else if (vartype == 'Macro') {
                                res = `${tabl}#define ${varname} ${value}${optional_parameter}\n`
                                fs.appendFileSync(outfile,res)
                            } else {
                                // Extended modified datatypes
                                vartype = vartype.replace("ulong_int","unsigned long int")
                                vartype = vartype.replace("long_int","signed long int")
                                vartype = vartype.replace("long_float","long double")

                                // Arquivo datatype
                                vartype = vartype.replace("File", "FILE*")
                                // File handling
                                value = value.replace('openfile','fopen')
                                value = value.replace('String.indexOf', 'indexOf')

                                // Standard transcript
                                res = `${tabl}${vartype} ${varname} = ${value}${optional_parameter};\n`
                                fs.appendFileSync(outfile,res)
                            }
                            //fs.appendFileSync(outfile,res)
                        }
                    }
                /* It does not have value for variable */
                } else {
                    if (vartype == 'mathematical') {
                        vartype = vartype.replace('mathematical','')
                        let res = `${tabl}float ${varname};\n`
                        fs.appendFileSync(outfile,res)
                    } else {
                        let res;
                        if (vartype == 'String') {
                            vartype = 'char'
                            if (varname.includes("[") && varname.includes("]")) {
                                res = `${tabl}${vartype} ${varname};\n`
                            } else {
                                res = `${tabl}${vartype} ${varname}[];\n`
                            }
                            
                        } else if (vartype == '*String') {
                            vartype = 'char*'
                            res = `${tabl}${vartype} ${varname};\n`
                            
                        } else {
                            res = `${tabl}${vartype} ${varname};\n`
                        }
                        
                        fs.appendFileSync(outfile,res)
                    }
                }
            }

            // Reatribuicao de variaveis   
            if (stack[i] == ':=') {
                let varname = stack[i-1]
                let value = stack[i+1]

                let res = `${tabl}${varname} = ${value};\n`
                fs.appendFileSync(outfile,res)
            }


            // Importar modulos
            if(stack[i] == 'import') {
                let libname = stack[i+1]
                fs.appendFileSync(outfile,tabl+`#include <${libname.slice(1,-1)}>\n`)
            }
            if(stack[i] == 'import_module') {
                let libname = stack[i+1]
                fs.appendFileSync(outfile,tabl+`#include ${libname}\n`)
            }
            if(stack[i] == 'include') {
                let libname = stack[i+1]
                let unix_include_path = '/usr/local/lib/crown'
                fs.appendFileSync(outfile,tabl+`#include "${unix_include_path}/${libname.slice(1,-1)}"\n`)
            }

            /*if (stack[i] == 'class') {
                let classname = stack[i+1]
                let inheritance = stack[i+3]
                let res
                if (stack[i+2] == '<') {
                    if (inheritance.slice(0,1) == '(') {
                        res = `${tabl}class ${classname}${inheritance}:\n`
                    } else {
                        res = `${tabl}class ${classname}(${inheritance}):\n`
                    }
                    
                } else {
                    res = `${tabl}class ${classname}:\n`
                }
                

                fs.appendFileSync(outfile, res)
                
            }*/
            if (stack[i] == 'fn') {
                let funcname = stack[i+1]
                let args = stack[i+2]
                let typedef = stack[i+4]

                // String return
                typedef = typedef.replace("*String", "const char*")
                typedef = typedef.replace("String", "const char*")

                // String function arguments
                args = args.replace("String", "char*")
                args = args.replace("*String","char*")


                /** CLI args */
                if (funcname == 'main') {
                    args = '(int argc, char* argv[])'
                }
                if (funcname == '__tokenize') {
                    args = `(char* buffer_tok, const char *s, char* arguments[])`
                }
                /** Standard Functions */
                let res = `${tabl}${typedef} ${funcname}${args}\n`
                fs.appendFileSync(outfile, res)
                
            }



            /** Function Return */
            if (stack[i] == 'return') {
                let res = `${tabl}return ${stack[i+1]};\n`
                fs.appendFileSync(outfile,res)
            }
            if (stack[i] == 'dump') {
                let varname = stack[i+3]
                let res;
                let id;
                if (stack[i+1] == 'int') {
                    id = '%d'
                }
                if (stack[i+1] == 'float') {
                    id = '%f'
                }
                if (stack[i+1] == 'String') {
                    id = '%s'
                }
                res = `for(int z = 0; z < ${varname}_size; z++) { printf("${id} ", ${varname}[z]); }\n`
                fs.appendFileSync(outfile,res)
            }

            if (stack[i] == 'drop') {
                let varname = stack[i+2]
                let res = `
//int ${varname}_size = sizeof(${varname})/sizeof(${varname}[0]);
int pos = ${varname}_size; // Determine position here
if(pos < 0 || pos > ${varname}_size) {
    printf("Invalid position!");
} else {
    /* Copy next element value to current element */
    for(int i=pos-1; i<${varname}_size-1; i++) {
        ${varname}[i] = ${varname}[i + 1];
    }

    /* Decrement array size by 1 */
    ${varname}_size = ${varname}_size-1;
}
`
                fs.appendFileSync(outfile,res)
            }


            if (stack[i] == 'shift' && stack[i+4] == 'in') {
                let varname = stack[i+1]
                let val = stack[i+3]
                let pos = stack[i+5]
                //let anonymous_id = crypto.randomBytes(16).toString("hex");
                let res = `
for(int i=${varname}_size-1;i>=${pos}-1;i--) {
    /* ${varname}[i+1]=${varname}[i]; */
    ${varname}[${pos}]= ${val};
} 
`


                /*`
int pos_${anonymous_id} = ${pos};
for(int i=${varname}_size-1;i>=pos_${anonymous_id};i--) {
    ${varname}[i+1]=${varname}[i];
    ${varname}[pos_${anonymous_id}]= ${val};   
}
`*/
                fs.appendFileSync(outfile,res)
            }

            if (stack[i+0] == 'String.substring'
            && stack[i+2] == 'from'
            && stack[i+4] == 'to') {
                let string = stack[i+1]
                let from_index = stack[i+3]
                let end_index = stack[i+5]
                let substring = stack[i+7]

                let res = `substring(${string},${substring}, ${from_index}, ${end_index});\n`
                fs.appendFileSync(outfile,res)
            }



            /* Function call based on parenthesis
            <function> <identifier><params>
            ~= <identifier><params> */
            if(stack[i].slice(0,1) == '('
            && stack[i-1].match(/[A-Za-z0-9]/)
            && stack[i-2] == undefined
            && stack[i+1] != 'do') {
                let funcname = stack[i-1]
                let args = stack[i]

                /* Custom functions of substitution */
                funcname = funcname.replace('print','printf')
                funcname = funcname.replace('input','scanf')

                // File handling
                funcname = funcname.replace('closefile','fclose')
                funcname = funcname.replace('io.write','fprintf')

                

                // String handling
                funcname = funcname.replace('String.concat','strcat')
                funcname = funcname.replace('String.assign','strcpy') //Assign one string to another

                // System Shell
                funcname = funcname.replace('System.execute','system')
                

                
                if(funcname == '__tokenize') {
                    let file = COMPILERX_STDIN_varname
                    let buffer = IOREAD_BUFFER

                    let aux_buffer = "buffer_"+crypto.randomBytes(16).toString("hex");
                    fs.appendFileSync(outfile, `char* ${aux_buffer};\n`)

                    //let anonymous_id = crypto.randomBytes(16).toString("hex");
                    args = `(${aux_buffer}, ${buffer}, argv)`
                }


                
                /* Transcription */
                res = `${tabl}${funcname}${args};\n`   
                fs.appendFileSync(outfile,res)



                /*if (stack.length > 3) {
                    let return_vartype = stack[i+2]
                    let return_varname = stack[i+3]
                    let res;
                    if (return_vartype == 'String') {
                        return_vartype = 'char'
                        res = `${tabl}${return_vartype} ${return_varname}[1024] = ${funcname}${args};\n`
                    } else {
                        res = `${tabl}${return_varname} = ${funcname}${args};\n`
                    }
                    fs.appendFileSync(outfile,res)
                }*/
            }


            // Condicionais
            if (stack[i] == 'if' || stack[i] == 'when') {
                let expression = stack[i+1]
                let ContainsDo = stack[i+2]

                // Novos operadores
                expression = expression.replace(/ is /gi," == ")
                expression = expression.replace(/ isnot /gi," != ")
                expression = expression.replace(/ and /gi," && ")
                expression = expression.replace(/ or /gi," || ")

                if (ContainsDo == 'do') {
                    let res = `${tabl}if (${expression.slice(1,-1)})\n`
                    fs.appendFileSync(outfile,res)
                    
                } else {
                    console.log(`Warning!  [if] requires [do] near ${expression}!`)
                }
                
            }

            if(stack[i] == 'elseif' || stack[i] == 'elsewhen') {
                let expression = stack[i+1]
                let ContainsDo = stack[i+2]

                // Novos operadores
                expression = expression.replace(/ is /gi," == ")
                expression = expression.replace(/ isnot /gi," != ")
                expression = expression.replace(/ and /gi," && ")
                expression = expression.replace(/ or /gi," || ")


                if (ContainsDo != undefined) {
                    let res = `${tabl}else if (${expression.slice(1,-1)})\n`
                    fs.appendFileSync(outfile,res)
                    
                } else {
                    console.log(`Warning!  [elseif] requires [do] near ${expression}!`)
                }
            }
            if (stack[i] == 'else') {
                let res = `${tabl}} else {\n`
                fs.appendFileSync(outfile,res)
                
            }
            if (stack[i] == 'while') {
                let expression = stack[i+1]
                let ContainsDo = stack[i+2]

                // Novos operadores
                expression = expression.replace(/ is /gi," == ")
                expression = expression.replace(/ isnot /gi," != ")
                expression = expression.replace(/ and /gi," && ")
                expression = expression.replace(/ or /gi," || ")


                if (ContainsDo != undefined) {
                    let res = `${tabl}while (${expression.slice(1,-1)})\n`
                    fs.appendFileSync(outfile,res)
                    
                } else {
                    console.log(`Warning!  [while] requires [do] near ${expression}!`)
                }
            }
            if (stack[i] == 'for') {
                let iterator = stack[i+1]
                let Min = stack[i+3].slice(0,stack[i+3].indexOf('.'))
                let Max = stack[i+3].slice(stack[i+3].indexOf('.')+2, stack[i+3].length)

                let res = `${tabl}for (int ${iterator}=${Min}; i<${Max}; i++)`
                fs.appendFileSync(outfile,res)
                
            }
            if (stack[i] == 'times') {
                let times = stack[i-1]
                let res = `${tabl}for (int i=0; i<${times}; i++)`
                fs.appendFileSync(outfile,res)
                
            }

            //Interromper ciclos
            if (stack[i] == 'break') {
                let res = `${tabl}break;\n`
                fs.appendFileSync(outfile,res)
            }
            if (stack[i] == 'continue') {
                let res = `${tabl}continue;\n`
                fs.appendFileSync(outfile,res)
            }


            if (stack[i] == 'struct') {
                struct_name = stack[i+1]
                let res = `typedef struct`
                fs.appendFileSync(outfile,res)
            }
            if (stack[i] == 'endstruct') {
                let res = `${tabl}} ${struct_name};\n\n`
                fs.appendFileSync(outfile,res)
            }

            if (stack[i] == 'lua_Stack') {
                let stackReg_name = stack[i+1]
                let res = `static const struct luaL_Reg ${stackReg_name} [] = `
                fs.appendFileSync(outfile,res)
            }
            if (stack[i] == 'lua_Reg') {
                let luaReg_name = stack[i+1]
                let res
                if (luaReg_name != 'null') {
                    res = `{ "${luaReg_name}", ${luaReg_name} },\n`
                } else {
                    res = `{ NULL, NULL }\n`
                }
                
                fs.appendFileSync(outfile,res)
            }

            // Do-While
            /*if (stack[i] == 'repeat') {
                let res = `do {\n`
                fs.appendFileSync(outfile,res)
            }
            if (stack[i] == 'until') {
                let statement = stack[i+1]
                let res = `\n} while ${statement};`
                fs.appendFileSync(outfile,res)
            }*/

            if (stack[i] == 'io.read') {
                let file = stack[i+1]
                let buffer = stack[i+3]
                IOREAD_BUFFER = buffer;
                FILEREAD_anonymous_id = crypto.randomBytes(16).toString("hex");
                
                // Must get string from read file
                let res = `    	
/* declare a file pointer */
FILE    *infile_${FILEREAD_anonymous_id};
char    *${buffer};
long    numbytes_${FILEREAD_anonymous_id};
 
/* open an existing file for reading */
infile_${FILEREAD_anonymous_id} = fopen(${file}, "r");
 
/* quit if the file does not exist */
if(infile_${FILEREAD_anonymous_id} == NULL)
    return 1;
 
/* Get the number of bytes */
fseek(infile_${FILEREAD_anonymous_id}, 0L, SEEK_END);
numbytes_${FILEREAD_anonymous_id} = ftell(infile_${FILEREAD_anonymous_id});
 
/* reset the file position indicator to 
the beginning of the file */
fseek(infile_${FILEREAD_anonymous_id}, 0L, SEEK_SET);	
 
/* grab sufficient memory for the 
buffer to hold the text */
${buffer} = (char*)calloc(numbytes_${FILEREAD_anonymous_id}, sizeof(char));	
 
/* memory error */
if(${buffer} == NULL)
    return 1;
 
/* copy all the text into the buffer */
fread(${buffer}, sizeof(char), numbytes_${FILEREAD_anonymous_id}, infile_${FILEREAD_anonymous_id});
//fgets(buff, BUZZ_SIZE, f);
fclose(infile_${FILEREAD_anonymous_id});
`

                fs.appendFileSync(outfile,res)
            }

            // New objects
            /*if(stack[i] == "@new") {
                let obj = stack[i+1]
                let classname = stack[i+3]
                let constructor_params = stack[i+4]
                //
                let res = `${tabl}${obj} = ${classname}${constructor_params}\n`
                fs.appendFileSync(outfile,res)
            }*/

            // Exception
            /*if (stack[i] == 'try') {
                let res = tabl+"try:\n"
                fs.appendFileSync(outfile,res)
                
            }
            if (stack[i] == 'catch') {
                //let exception_type = stack[i+1]
                let res = tabl+`except:\n`
                fs.appendFileSync(outfile,res)
                
            }
            if (stack[i] == 'finally') {
                let res = tabl+"finally:\n"
                fs.appendFileSync(outfile,res)
                
            }*/

            if (stack[i] == '__initialize'
            && stack[i+1] == 'with'
            && stack[i+3] == 'and') {
                COMPILERX_STDIN_varname = stack[i+2];
                COMPILERX_STDOUT_varname = stack[i+4];

                varname = COMPILERX_STDIN_varname;
                fs.appendFileSync(outfile, `
char buf[1024];
size_t i, stackc;
char *stack[20];

FILE* ${varname};
${varname} = fopen(arguments[3],"w");       // ./<exec> <input>.x -o <output>.y

if(${varname} == NULL) {
    printf("\\nError PointerException!\\n");   
    exit(1);             
}

strcpy(buf, s);
stackc = split_token(buf, stack, 20);
for (i = 0; i < stackc; i++) `)
            }
            if (stack[i] == 'free') {
                //let varname = stack[i+1]
                let res = `fclose(${COMPILERX_STDIN_varname});\n`
                fs.appendFileSync(outfile,res)
            }
            // Compare two strings in ANSI-C
            if(stack[i] == 'equals' && stack[i+2] == 'and') {
                /*
                equals stack[i] and if_tok do
                    ...
                end
                */
                let val1 = stack[i+1]
                let val2 = stack[i+3]
                let res = `${tabl}if (strcmp(${val1},${val2})==0)`
                fs.appendFileSync(outfile,res)
            }
            if(stack[i] == 'elsequals' && stack[i+2] == 'and') {
                /*
                equals stack[i] and if_tok do
                    ...
                end
                */
                let val1 = stack[i+1]
                let val2 = stack[i+3]
                let res = `${tabl}} else if (strcmp(${val1},${val2})==0)`
                fs.appendFileSync(outfile,res)
            }
        }
        //console.log(list)
    })
}

if (process.argv.length > 2) {
    // enable "using debugging" for compiling tests - show *.c gencode.
    __Compile()
    child_process.execSync(`${cc} ${outfile} ${flag} ${outfile_lState}`)
    if (is_debugging == true) {
        // Nothing ...
    } else {
        fs.unlinkSync(outfile)
    }
    
} else {
    Help()
}