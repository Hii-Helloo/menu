import pandas as pd

# 첫 번쨰 시트 읽기
df=pd.read_excel("식단.xlsx")

#처음 5줄 출력
print(df.head())

#JSON 파일로 저장
df.to_json("menu.json", orient="records", force_ascii=False,indent=4,date_format="iso")

print("menu.json 생성 완료!")