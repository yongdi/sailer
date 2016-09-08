url="fms2.91jkys.com/api/buckets/91jkys-static/"
folder="sailer/"
for file in `find build/ _book/`
  do
    if [ -f $file ]; then 
        fileName=${file/\/\///}
        echo "$url$folder$fileName"
        curl -X PUT --data-binary @$file $url$folder$fileName -H 'Content-Type: '
    fi
 done
