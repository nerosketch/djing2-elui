#!/usr/bin/env python
import subprocess
import json
from transliterate import translit
from libretranslatepy import LibreTranslateAPI

lt = LibreTranslateAPI("http://localhost:5000/")


dct = {
  "abonenty-na-portu": "Абоненты на порту",
  "abonenty-na-portu-ne-naideny": "Абоненты на порту не найдены",
  "abonenty-ne-naideny": "Абоненты не найдены",
  "abonov": "Абонов",
  "abony-s-uslugoi": "Абоны с услугой",
  "actual-spending": "Actual Spending",
  "admin": "Админ.",
  "administration": "Administration",
  "administrativnaya": "Административная",
  "administrativnyi": "Административный",
  "adres": "Адрес",
  "adres-dostavki-schyota": "Адрес доставки счёта",
  "adres-elektronnoi-pochty": "Адрес электронной почты",
  "adres-ustanovki": "Адрес установки",
  "adresa": "Адреса",
  "adresnyi-obekt-dobavlen": "Адресный объект добавлен",
  "adresnyi-obekt-izmenyon": "Адресный объект изменён",
  "aktivnost-abonentov": "Активность абонентов",
  "aktivnye": "Активные",
  "aktivnykh-abon": "Активных абон.",
  "aktualnost": "Актуальность",
  "all-rights-reserved": "All rights reserved",
  "allocated-budget": "Allocated Budget",
  "arendy-ip": "Аренды ip",
  "avtor-zadachi": "Автор задачи: {0}",
  "back-to-home": "Back to home",
  "balans": "Баланс",
  "bazovyi-raschyotnyi-funkcional": "Базовый расчётный функционал",
  "brauzer": "Браузер",
  "bums": "Bums",
  "burst": "Бурст",
  "cena": "Цена",
  "cena-dolzhna-byt-polozhitelnoi-ili": "Цена должна быть положительной или 0",
  "cena-dolzhna-byt-ukazana": "Цена должна быть указана",
  "cenu-nado-ukazat": "Цену надо указать",
  "chastota-ispolzovaniya-kharakterov-zadach": "Частота использования характеров задач",
  "chat-bot-izmenyon": "Чат бот изменён",
  "chat-bot-udalyon": "Чат бот \"{0}\" удалён",
  "chat-bot-sozdan": "Чат бот создан",
  "chto-to-zavershyonnoe": "Что-то завершённое",
  "comments": "Comments",
  "customer-support": "Customer Support",
  "data": "Дата",
  "data-nachala-deistviya-dogovora": "Дата начала действия договора",
  "data-sozdaniya": "Дата создания",
  "data-vvedeniya-v-ekspluataciyu": "Дата введения в эксплуатацию",
  "deistvitelno-udalit-gruppu": "Действительно удалить группу",
  "deistvitelno-udalit-gruppu-group-title": "Действительно удалить группу \"{0}\"?",
  "deistvitelno-udalit-kvitanciyu-pay-name": "Действительно удалить квитанцию \"{0}\"?",
  "deistvitelno-udalit-onu-this-device-comment": "Действительно удалить onu \"{0}\"?",
  "deistvitelno-udalit-platyozh-shot-name": "Действительно удалить платёж \"{0}\"?",
  "deistvitelno-udalit-pul-pool-network": "Действительно удалить пул \"{0}\"?",
  "deistvitelno-udalit-sessiyu-lease-ip_address": "Действительно удалить сессию \"{0}\"?",
  "deistvitelno-udalit-uslugu-srv-title": "Действительно удалить услугу \"{0}\"?",
  "deistvitelno-udalit-ustroistvo-dev-comment": "Действительно удалить устройство \"{0}\"?",
  "deistvitelno-udalit-vlan-vlan-title": "Действительно удалить влан \"{0}\"?",
  "den-rozhdeniya": "День рождения",
  "detali-zadachi": "Детали задачи",
  "development": "Development",
  "devid-required": "devId required.",
  "dinamicheskii": "Динамический",
  "dobavit-domen": "Добавить домен",
  "dobavit-gruppu": "Добавить группу",
  "dobavit-messenger": "Добавить Messenger",
  "dobavit-onu": "Добавить ONU",
  "dobavit-polya": "Добавить поля",
  "dobavit-shlyuz": "Добавить шлюз",
  "dobavit-uchyotku": "Добавить учётку",
  "dobavit-uchyotnuyu-zapis": "Добавить учётную запись",
  "dobavit-ustroistvo": "Добавить устройство",
  "dobavit-zadachu": "Добавить задачу",
  "dobavlenie": "Добавление",
  "dolzhno-soderzhat-tolko-chislo": "Должно содержать только число",
  "dom-ustar": "Дом (устар)",
  "doma": "№ дома",
  "domen": "Домен",
  "domen-izmenyon": "Домен изменён",
  "domen-nado-ukazat": "Домен надо указать",
  "dop-info-dlya-snmp": "Доп. инфо для snmp",
  "dopolnitelnoe": "Дополнительное",
  "doverennyi": "Доверенный",
  "drugoe": "другое",
  "edinorazovye-platezhi": "Единоразовые платежи",
  "epochta": "ЭПочта",
  "eshyo-chto-to": "ещё что-то",
  "expected-spending": "Expected Spending",
  "fiberaddr-required": "fiberAddr required.",
  "finance": "Finance",
  "finansy": "Финансы",
  "fio": "ФИО",
  "fio-direktora": "Фио директора",
  "fio-direktora-obyazatelno": "Фио директора обязательно",
  "formy": "Формы",
  "foto": "Фото",
  "gostevoi": "Гостевой",
  "gostevye-sessii": "Гостевые сессии",
  "greater-than": ">",
  "gruppa": "Группа",
  "gruppa-group-title-udalena": "Группа \"{0}\" удалена",
  "gruppa-izmenena": "Группа изменена",
  "gruppa-sokhranena": "Группа сохранена",
  "gruppa-ualena": "Группа уалена",
  "gruppa-udalena": "Группа удалена",
  "gruppirovat-po-dnyu": "Группировать по дню",
  "gruppirovat-po-mesyacu": "Группировать по месяцу",
  "gruppirovat-po-nedele": "Группировать по неделе",
  "gruppy": "Группы",
  "gruppy-polzovatelei": "Группы пользователей",
  "gruppy-sotrudnikov": "Группы сотрудников",
  "id-oborudovaniya-ne-peredan": "Id оборудования не передан",
  "imya": "Имя",
  "imya-i-otchestvo": "Имя и отчество",
  "info": "Info",
  "informaciya-ustroistva": "Информация устройства",
  "information-technology": "Information Technology",
  "inn": "ИНН",
  "inn-nuzhno-zapolnit": "ИНН нужно заполнить",
  "interfeis": "Интерфейс:",
  "internet": "Интернет",
  "ip-adres": "IP Адрес",
  "ip-adres-device-ip_address-or-or": "IP адрес: {0}",
  "ip-konflikt": "ip конфликт",
  "ip-vkhoda": "Ip входа",
  "iskhod-sk": "Исход.ск.",
  "iskhod-skorost": "Исход. скорость",
  "iskhodyashikh-bait": "Исходящих байт",
  "iskhodyashikh-paketov": "Исходящих пакетов",
  "isnew-sozdanie-izmenenie-odnorazovogo-platezha": "{0} одноразового платежа",
  "isnew-sozdanie-izmenenie-periodicheskogo-platezha": "{0} периодического платежа",
  "isnew-sozdanie-izmenenie-uslugi": "{0} услуги",
  "ispolniteli": "Исполнители",
  "isprav-oshibki-formy": "Исправь ошибки формы",
  "ispravit": "Исправить",
  "izmenenie": "Изменение",
  "izmenenie-sessii": "Изменение Сессии",
  "izmenit": "Изменить",
  "izmenit-gruppu": "Изменить группу",
  "izmenit-onu": "Изменить ONU",
  "izmenit-platyozhnyi-shlyuz": "Изменить платёжный шлюз",
  "izmenit-prava-dlya-gruppy": "Изменить права для группы",
  "izmenit-shlyuz-dostupa": "Изменить шлюз доступа",
  "izmenyon-rezhim-trunk-success": "Изменён режим Trunk/Success",
  "kakae-to-opisanie-nuzhno": "Какае-то описание нужно",
  "kakoi-to-drugoi-progress": "Какой-то другой прогресс",
  "kbaity": "КБайты",
  "key": "—",
  "kharakter-polomki": "Характер поломки",
  "klass-shlyuza": "Класс шлюза",
  "knopki": "Кнопки",
  "kol-polz": "Кол.польз.",
  "kol-prav": "Кол. прав",
  "kol-uchyotok": "Кол. учёток",
  "kolich-platezhei": "Колич. платежей",
  "kolichestvo": "Количество",
  "kolichestvo-platezhei": "Количество платежей",
  "komment": "Коммент",
  "kommentarii-udalyon": "Комментарий удалён",
  "kon-ip": "Кон. ip",
  "konechnyi-ip-nado-ukazat": "Конечный ip надо указать",
  "krasnyi-krestik": "красный крестик",
  "kto-imeet-prava-na-gruppu-abonentov": "Кто имеет права на группу абонентов+`",
  "kto-imeet-prava-na-uchyotnuyu-zapis": "Кто имеет права на учётную запись",
  "kto-imeet-prava-na-uslugu": "Кто имеет права на услугу",
  "kto-imeet-prava-na-ustroistvo": "Кто имеет права на устройство",
  "linux": "Linux",
  "log-avtorizacii": "Лог авторизаций",
  "log-deistvii": "Лог действий",
  "log-human_representation": "{0}.",
  "logic-error-on-contractform-in-onsubmit": "Logic error on contractForm in onSubmit()",
  "login": "Логин",
  "login-dlya-vkhoda": "Логин для входа",
  "login-mozhet-soderzhat-latinskie-simvoly-i-cifry": "Логин может содержать латинские символы и цифры",
  "login-ne-mozhet-byt-pustym": "Логин не может быть пустым",
  "loid-parol": "LOID пароль",
  "mac-adres": "MAC Адрес",
  "mac-ne-mozhet-byt-pustym": "MAC не может быть пустым",
  "mac-ne-nuzhno-ostavlyat-pustym": "MAC не нужно оставлять пустым",
  "mak": "Мак",
  "mak-adres-s-olt": "Мак адрес с OLT:",
  "mak-adres-v-bilinge-ne-sovpadaet-s-mak-adresom-poluchennym-s-olt": "Мак адрес в билинге не совпадает с мак адресом, полученным с OLT. Можно попробовать воспользоваться кнопкой ниже \"Исправить\". Если и она не помогает, \"ONU не найдена на OLT\" то это значит что нет связи между ONU и OLT, и конфигурации этой ONU на OLT тоже нет. Так же можно проверить место на \"глазе\" olt, может он заполнен.",
  "maksimum-32-simvola-dlya-slug": "Максимум 32 символа для slug",
  "markers": "Markers",
  "marketing": "Marketing",
  "messendzhery": "Мессенджеры",
  "mikrotik": "Микротик",
  "nach-ip": "Нач. ip",
  "nado-ukazat-novyi-parol": "Надо указать новый пароль",
  "nado-ukazat-staryi-parol": "Надо указать старый пароль",
  "nado-vybrat-khotyaby-odnogo-ispolnitelya": "Надо выбрать хотябы одного исполнителя",
  "nastroika-onu": "настройка onu",
  "nastroika-routera": "настройка роутера",
  "nastroika-vlan-ne-prinimaetsya-vybrannym-konfigom": "Настройка VLAN не принимается выбранным конфигом",
  "nastroiki-s-porta-portnum-udaleny": "Настройки с порта №{0} удалены",
  "naznachit-prinadlezhnost-gruppam-polzovatelei": "Назначить принадлежность группам пользователей",
  "nazvanie": "Название",
  "nazvanie-dlya-messendzhera-nado-ukazat": "Название для мессенджера надо указать",
  "nazvanie-domena-nado-ukazat": "Название домена надо указать",
  "nazvanie-gruppy-nado-ukazat": "Название группы надо указать",
  "nazvanie-nado-ukazat": "Название надо указать",
  "nazvanie-nuzhno-ukazat": "Название нужно указать",
  "nazvanie-platezha": "Название платежа",
  "nazvanie-vlan-nado-ukazat": "Название vlan надо указать",
  "ne-naiden-vid": "Не найден vid=",
  "ne-nashyol-prava-na-chtenie": "Не нашёл права на чтение",
  "ne-opredeleno": "не определено",
  "ne-opredelyon": "Не определён",
  "ne-peredan-id-zadachi": "Не передан ID задачи",
  "ne-pokhozhe-na-adres-pochty": "Не похоже на адрес почты",
  "ne-udalili-pokhozhe-uzhe-kto-to-udalil": "Не удалили, похоже уже кто-то удалил",
  "ne-udalos-poluchit-gruppy": "Не удалось получить группы",
  "ne-vybran": "Не выбран",
  "ne-vybrano": "Не выбрано",
  "nedostatochno-prav": "Недостаточно прав",
  "net-informacii-ob-onu-pole-dop-info-dlya-snmp-v-forme-redaktirov": "Нет информации об ONU. (Поле \"Доп. инфо для snmp\" в форме редактирования устройства). Возможно, onu не зарегистрирована.",
  "network": "Network",
  "nezaregistrirovannye-yunity": "Незарегистрированные юниты",
  "nizkii": "Низкий",
  "nomer-dogovora-mozhet-soderzhat-latinskie-simvoly-i-cifry": "Номер договора может содержать латинские символы и цифры",
  "nomer-doma-ust": "Номер дома(уст.)",
  "nomer-telefona": "Номер телефона",
  "nomer-telefona-obyazatelno": "Номер телефона обязательно",
  "novaya": "Новая",
  "novaya-gruppa-dobavlena": "Новая группа добавлена",
  "novaya-onu-sokhranena": "Новая onu сохранена",
  "novoe-ustroistvo-sokhraneno": "Новое устройство сохранено",
  "novye-zadachi": "Новые задачи",
  "novyi-domen-sozdan": "Новый домен создан",
  "novyi-parol": "Новый пароль",
  "nuzhen-login-iz-latinskikh-simvolov-i-cifr": "Нужен логин из латинских символов и цифр",
  "nuzhno-kak-to-nazvat-port": "Нужно как-то назвать порт",
  "nuzhno-povtorit-novyi-parol": "Нужно повторить новый пароль",
  "nuzhno-ukazat-tip-ustroistva": "Нужно указать тип устройства",
  "nuzhno-ukazat-yuridicheskii-adres": "Нужно указать юридический адрес",
  "nuzhno-vybrat-abonenta": "Нужно выбрать абонента",
  "nuzhno-vybrat-iz-spiska-znachenii-podkhodyashii-tip-yurlica": "Нужно выбрать из списка значений подходящий тип юрлица",
  "nuzhno-vybrat-tip": "Нужно выбрать тип",
  "nuzhno-vybrat-tip-fias": "Нужно выбрать тип ФИАС",
  "nuzhno-vybrat-uroven": "Нужно выбрать уровень",
  "nuzhno-znat-kak-zovut-vladelca-uchyotki": "Нужно знать как зовут владельца учётки",
  "nuzhno-znat-s-kakim-api-budet-rabotat-bot": "Нужно знать с каким API будет работать бот",
  "oborudovanie": "Оборудование",
  "oborudovanie-ne-naideno": "Оборудование не найдено",
  "oborudovanie-this-store-state-address-title": "Оборудование - {0}",
  "obryv-kabelya": "обрыв кабеля",
  "obyazatelno": "Обязательно",
  "obzhat-kabel": "обжать кабель",
  "ogrn": "ОГРН",
  "ok": "Ok",
  "onu-uspeshno-zaregistrirovana": "ONU успешно зарегистрирована",
  "oper": "Oper",
  "opisanie": "Описание",
  "opisanie-obyazatelno": "Описание обязательно",
  "opisanie-store-state-task-descr": "Описание: {0}",
  "oplativshie": "Оплатившие",
  "opoveshat-pri-sobytiyakh-monitoringa": "Оповещать при событиях мониторинга",
  "opovesheniya": "Оповещения",
  "organizacii": "Организации",
  "organizaciya": "Организация",
  "ostanovit-webhook": "Остановить webhook",
  "otchyot-o-postupleniyakh": "Отчёт о поступлениях",
  "otchyoty-vsyakie": "Отчёты всякие",
  "otmena": "Отмена",
  "otpravit-webhook-url": "Отправить webhook url",
  "otvetstvennost-za-gruppy": "Ответственность за группы",
  "otvetstvennost-za-gruppy-sokhranena": "Ответственность за группы сохранена",
  "pakety": "Пакеты",
  "parameters-required": "Parameters required",
  "parol": "пароль",
  "parol-dlya-vkhoda": "Пароль для входа",
  "parol-ne-mozhet-byt-pustym": "Пароль не может быть пустым",
  "parol-sostoit-minimum-iz-6ti-simvolov": "Пароль состоит минимум из 6ти символов",
  "parol-uspeshno-izmenyon": "Пароль успешно изменён",
  "paroli-dolzhny-sovpadat": "Пароли должны совпадать",
  "passport": "Passport",
  "periodicheskie-platezhi": "Периодические платежи",
  "periodicheskoe-propadanie": "периодическое пропадание",
  "ping": "Ping",
  "platyozhnyi-shlyuz": "Платёжный шлюз",
  "platyozhnyi-shlyuz-dobavlen": "Платёжный шлюз добавлен",
  "please-check-that-the-url-you-entered-is-correct-or-click-the-bu": "Please check that the URL you entered is correct, or click the button below to return to the homepage.",
  "po-umolchaniyu": "По умолчанию",
  "pochtovyi-adres": "Почтовый адрес",
  "pochtovyi-indeks": "Почтовый индекс",
  "pochtovyi-indeks-adresa-dostavki-schyota": "Почтовый индекс адреса доставки счёта",
  "pochtovyi-indeks-pochtovogo-adresa": "Почтовый индекс почтового адреса",
  "pochtovyi-indeks-soderzhit-ne-bolee-6ti-simvolov": "Почтовый индекс содержит не более 6ти символов",
  "pochtovyi-indeks-yuridicheskogo-adresa": "Почтовый индекс юридического адреса",
  "podklyuchenie": "подключение",
  "podrobnosti-bota": "Подробности бота",
  "podrobnosti-bota-store-state-messenger-title": "Подробности бота \"{0}\"",
  "podset": "Подсеть",
  "podset-nado-ukazat": "Подсеть надо указать",
  "podset-sokhranena": "Подсеть сохранена",
  "podset-udalena": "Подсеть удалена",
  "podseti": "Подсети",
  "searchBy": "Поиск по: {0}",
  "pole": "Поле",
  "pole-udaleno": "Поле удалено",
  "polya": "Поля",
  "polzov-teg": "Пользов. тэг",
  "polzovateli-uslugi": "Пользователи услуги",
  "polzovatelskii-teg": "Пользовательский тэг",
  "pomenyat-parol": "Поменять пароль",
  "port": "Порт",
  "port-dolzhen-soderzhat-unikalnye-vlan": "Порт должен содержать уникальные vlan",
  "port-id-ne-peredan": "Port id не передан",
  "port-kommutatora": "Порт коммутатора",
  "port-ne-mozhet-soderzhat-bolshe-odnogo-access-vlan": "Порт не может содержать больше одного access vlan",
  "port-portnum": "Порт №{0}",
  "port-uspeshno-izmenyon": "Порт успешно изменён",
  "port-uspeshno-sokhranyon": "Порт успешно сохранён",
  "port-uspeshno-udalyon": "Порт успешно удалён",
  "porta": "№ порта",
  "portid-parameter-is-required": "portId parameter is required",
  "poslednie-3-mesyaca": "Последние 3 месяца",
  "poslednii-mesyac": "Последний месяц",
  "poslednyaya-nedelya": "Последняя неделя",
  "povtori-parol": "Повтори пароль",
  "prava-dlya-gruppy-sokhraneny": "Права для группы сохранены",
  "prava-dlya-polzovatelsya-sokhraneny": "Права для пользователся сохранены",
  "prava-na-klassy-deistvii": "Права на классы действий",
  "prikreplyonnye-abonenty": "Прикреплённые абоненты:",
  "primenit": "Применить",
  "primer-ip-192-168-0-23": "Пример ip: 192.168.0.23",
  "primer-mac-0a-0b-cc-dd-ee-ff": "Пример mac: 0a:0b:cc:dd::ee:ff",
  "primer-podseti-192-168-0-0-24": "Пример подсети: 192.168.0.0/24",
  "primer-shlyuza-192-168-0": "Пример шлюза: 192.168.0.1",
  "prinadlezhnost-gruppy-saitam-sokhranena": "Принадлежность группы сайтам сохранена",
  "prinadlezhnost-oborudovaniya-saitam": "Принадлежность оборудования сайтам",
  "prinadlezhnost-oborudovaniya-saitam-sokhranena": "Принадлежность оборудования сайтам сохранена",
  "prinadlezhnost-platyozhnogo-shlyuza-saitam-sokhranena": "Принадлежность платёжного шлюза сайтам сохранена",
  "prinadlezhnost-podseti-saitam-sokhranena": "Принадлежность подсети сайтам сохранена",
  "prinadlezhnost-saitam": "Принадлежность сайтам",
  "prinadlezhnost-uchyotnykh-zapisei-saitam-sokhranena": "Принадлежность учётных записей сайтам сохранена",
  "prinadlezhnost-uslugi-saitam-sokhranena": "Принадлежность услуги сайтам сохранена",
  "prinadlezhnost-vida-platezhei-saitam-sokhranena": "Принадлежность вида платежей сайтам сохранена",
  "prinadlezhnost-vlan-saitam-sokhranena": "Принадлежность vlan сайтам сохранена",
  "prioritet": "Приоритет",
  "prodolzhitelnost-sessii": "Продолжительность сессии",
  "provalena": "Провалена",
  "provalennye-zadachi": "Проваленные задачи",
  "put": "путь",
  "raspredelenie-ispolzovaniya-uslug-abonentami": "Распределение использования услуг абонентами",
  "redaktirovat": "Редактировать",
  "redaktirovat-zadachu-taskid": "Редактировать задачу № {0}",
  "rezhim": "Режим",
  "rodit-ustroistvo": "Родит. устройство",
  "roditelskoe-ustr": "Родительское устр.:",
  "roditelskoe-ustroistvo": "Родительское устройство:",
  "s-administrativnymi-uslugami": "С административными услугами",
  "s-besplatnymi-uslugami": "С бесплатными услугами",
  "s-uslugoi": "С услугой",
  "saity": "Сайты",
  "sales": "Sales",
  "secret": "Secret",
  "seriinik": "Серийник",
  "service-id": "Service ID",
  "service-id-obyazatelno": "Service ID обязательно",
  "services": "Services",
  "sessiya-izmenena": "Сессия изменена",
  "sessiya-udalena": "Сессия удалена",
  "set": "Сеть",
  "shablon-konfiga": "Шаблон конфига",
  "shablon-konfiga-dlya-onu": "Шаблон конфига для ONU",
  "shlyuz": "Шлюз",
  "shlyuz-dostupa-sokhranyon": "Шлюз доступа сохранён",
  "shlyuz-dostupa-uspeshno-udalyon": "Шлюз доступа успешно удалён",
  "shlyuz-nado-ukazat": "Шлюз надо указать",
  "shlyuzy": "Шлюзы",
  "sistemnyi-teg": "Системный тэг",
  "skachat-csv": "Скачать csv",
  "skopirovat-adres-iz-yuridicheskogo-adresa": "Скопировать адрес из юридического адреса",
  "skorost-dolzhna-byt-polozhitelnoi": "Скорость должна быть положительной",
  "skript": "Скрипт",
  "slabaya-skorost": "слабая скорость",
  "slug": "Slug",
  "smotret": "Смотреть",
  "snmp-community": "SNMP Community",
  "snmp-nom": "SNMP Ном.",
  "sokhranit": "Сохранить",
  "sokhranit-onu": "Сохранить ONU",
  "sostoyanie": "Состояние",
  "sostoyanie-onu": "Состояние ONU",
  "sotrudniki": "Сотрудники",
  "sozdanie-zadachi": "Создание задачи",
  "sozdat-messenger": "Создать messenger",
  "sozdat-platyozhnyi-shlyuz": "Создать платёжный шлюз",
  "spisok-onu-na-glazu": "Список ONU на глазу",
  "spravochnik-adresnykh-obektov": "Справочник адресных объектов",
  "srednii": "Средний",
  "startovyi-ip-nado-ukazat": "Стартовый ip надо указать",
  "staryi-parol": "Старый пароль",
  "stoimost": "Стоимость",
  "summa": "Сумма",
  "superpolzovatel": "Суперпользователь",
  "sutochnaya": "Суточная",
  "t-adresnyi-obekt": "{0} адресный объект",
  "t-domen": "{0} домен",
  "tablica-mac-adresov-porta": "Таблица MAC адресов порта",
  "tarify": "Тарифы",
  "task-id-expected-from-backend": "Task id expected from backend",
  "tekushii-webhook-url": "Текущий webhook url:",
  "telefon": "Телефон",
  "tip": "Тип",
  "tip-adresa-fias": "Тип адреса ФИАС",
  "tip-adresnogo-obekta": "Тип адресного объекта",
  "tip-bota": "Тип бота",
  "tip-nas": "Тип NAS",
  "tip-oborudovaniya": "Тип оборудования",
  "tip-polya": "Тип поля",
  "tip-seti": "Тип сети",
  "tip-yurlica": "Тип юрлица",
  "tip-yurlica-obyazatelen": "Тип юрлица обязателен",
  "token": "Токен",
  "token-dlya-messendzhera-nado-ukazat": "Токен для мессенджера надо указать",
  "tolko-latinica": "Только латиница",
  "ty-deistvitelno-khochesh-udalit-chat-bot-m-title": "Ты действительно хочешь удалить чат бот \"{0}\"?",
  "uchyotka-dobavlena": "Учётка добавлена",
  "uchyotka-sokhranena": "Учётка сохранена",
  "uchyotnaya-zapis-newaccount-title-uspeshno-sozdana": "Учётная запись \"{0}\" успешно создана",
  "uchyotnaya-zapis-patchedaccount-title-uspeshno-obnovlena": "Учётная запись \"{0}\" успешно обновлена",
  "uchyotnaya-zapis-udalena": "Учётная запись удалена",
  "uchyotnye-zapisi": "Учётные записи",
  "udalena": "Удалена",
  "udaleno": "Удалено",
  "udalit": "Удалить",
  "udalit-file-name": "Удалить \"{0}\"?",
  "udalit-gruppu-abonentov": "Удалить группу абонентов?",
  "udalit-nastroiki-s-porta": "Удалить настройки с порта?",
  "udalit-platyozhnyi-shlyuz": "Удалить платёжный шлюз?",
  "udalit-pole": "Удалить поле",
  "udalit-port-port-descr": "Удалить порт \"{0}\"?",
  "udalit-s-olt": "Удалить с OLT",
  "udalit-shlyuz-dostupa-abonentov": "Удалить шлюз доступа абонентов?",
  "udalit-uchyotnuyu-zapis": "Удалить учётную запись?",
  "ukazhi-iskhodyashuyu-skorost": "Укажи исходящую скорость",
  "ukazhi-ustroistvu-kakoe-to-imya": "Укажи устройству какое-то имя",
  "ukazhi-vkhodyashuyu-skorost": "Укажи входящую скорость",
  "upravl": "Управл.",
  "upravlenie": "Управление",
  "ur-signala": "Ур. сигнала",
  "uroven-dostupa": "Уровень доступа",
  "uroven-fias": "Уровень ФИАС",
  "uroven-signala": "Уровень сигнала:",
  "uskorenie": "Ускорение",
  "usluga-izmenena": "Услуга изменена",
  "usluga-sozdana": "Услуга создана",
  "usluga-udalena": "Услуга удалена",
  "uspeshno-sokhraneno": "Успешно сохранено",
  "ustroistva": "Устройства",
  "v-knopku-ne-peredano-ustroistvo": "В кнопку не передано устройство",
  "v-seti": "В сети",
  "v-title-v-vid": "{0} [{1}]",
  "v-vid-v-title": "[{0}] {1}",
  "varianty-konfiguracii-na-onu": "Варианты конфигурации на ONU",
  "vechnaya-usluga-10-let": "\"Вечная\" услуга (10 лет)",
  "versiya-proshivki": "Версия прошивки",
  "vkhod": "Вход",
  "vkhod-sk": "Вход.ск.",
  "vkhod-skorost": "Вход. скорость",
  "vkhodyashikh-bait": "Входящих байт",
  "vkhodyashikh-paketov": "Входящих пакетов",
  "vkl-vykl": "Вкл/Выкл",
  "vklyuchen": "Включен",
  "vklyuchyon": "Включён",
  "vklyuchyon-li": "Включён-ли",
  "vklyuchyonnye": "Включённые",
  "vlan": "Vlan",
  "vlan-mozhet-byt-v-predelakh-2-4094": "Vlan может быть в пределах 2-4094",
  "vlan-na-port-portvlanconf-port": "Vlan на порт №{0}",
  "vlan-remvlan-vid-udalyon-s-porta-this-portvlanconf-port": "Влан {0} удалён с порта №{1}",
  "vlan-udalyon": "Vlan удалён",
  "vlany": "Vlan'ы",
  "voiti": "Войти",
  "vremeni-ostalos": "Времени осталось:",
  "vremennoi-srez": "Временной срез:",
  "vremya": "Время",
  "vremya-poslednego-obnovleniya": "Время последнего обновления",
  "vremya-sozdaniya-arendy": "Время создания аренды",
  "vremya-starta": "Время старта",
  "vse-nezavershyonnye": "Все незавершённые",
  "vse-zadachi": "Все задачи",
  "vsego": "Всего",
  "vsego-abon": "Всего абон.",
  "vyberi-tip-messenzhera": "Выбери тип мессенжера",
  "vydeleno": "Выделено",
  "vydelit-prava-na-chtenie": "Выделить права на чтение",
  "vypolnena": "Выполнена",
  "vypolnennye-zadachi": "Выполненные задачи",
  "vysshii": "Высший",
  "w-podset": "{0} подсеть",
  "yavlyaetsya-li-administrativnoi-uslugoi": "Является-ли административной услугой.",
  "yavlyaetsya-li-vlanom-upravleniya": "Является-ли вланом управления.",
  "yuridicheskii-adres": "Юридический адрес",
  "zadacha-deistvitelna-do": "Задача действительна до",
  "zadacha-dobavlena": "Задача добавлена",
  "zadacha-po-taskmodule-customer_full_name": "Задача по {0}",
  "zadacha-seichas-budet-udalena-vnimatelno": "Задача сейчас будет удалена, внимательно",
  "zadacha-sokhranena": "Задача сохранена",
  "zadacha-udalena": "Задача удалена",
  "zadacha-zavershena": "Задача завершена",
  "zagruzka": "Загрузка...",
  "zakryt": "Закрыт",
  "zavershit": "Завершить",
  "zavershit-sessiyu": "Завершить сессию?",
  "zhelezka": "Железка",
  "zhyoltyi-treugolnik": "жёлтый треугольник"
}

def replace(fromstr, tostr):
    r = subprocess.run(['./lang/replace.sh', fromstr, tostr], shell=False)
    print(r)


def translate(text):
    return lt.translate(text, 'ru', 'en')


def prepare_key(key):
    r = key.title().replace(' ', '')
    r = r.replace('/', '')
    r = r.replace("'", '')
    r = translit(r, language_code='ru', reversed=True)
    r = r[:1].lower() + r[1:]
    return r



def main():
    res_ru = {}
    res_en = {}
    for key, val in dct.items():
        if '{' in val or '}' in val:
            continue
        translated_val = translate(val)
        translated_key = prepare_key(translated_val)
        replace(key, translated_key)
        res_ru[translated_key] = val
        res_en[translated_key] = translated_val
    with open('lang/ru.json', 'w') as f:
        json.dump(res_ru, f, ensure_ascii=False)
    with open('lang/en.json', 'w') as f:
        json.dump(res_en, f, ensure_ascii=False)


if __name__ == '__main__':
    main()
